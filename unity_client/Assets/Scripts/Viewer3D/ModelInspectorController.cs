using UnityEngine;
using UnityEngine.EventSystems;
using GramSikha.Core;
using GramSikha.Data;

namespace GramSikha.Viewer3D
{
    /// <summary>
    /// Controls the 3D model inspection scene: camera orbiting, zooming, panning,
    /// model turntable rotation, reset camera view, and raycast sub-part selection.
    /// </summary>
    public class ModelInspectorController : MonoBehaviour
    {
        [Header("Target & Spawn Anchor")]
        [Tooltip("Center point around which camera orbits")]
        [SerializeField] private Transform pivotPoint;
        [Tooltip("Parent transform where selected 3D model is instantiated")]
        [SerializeField] private Transform modelSpawnAnchor;

        [Header("Orbit & Sensitivity")]
        [SerializeField] private float xOrbitSpeed = 120.0f;
        [SerializeField] private float yOrbitSpeed = 80.0f;
        [SerializeField] private float yMinLimit = -20f;
        [SerializeField] private float yMaxLimit = 80f;
        [SerializeField] private float smoothTime = 0.12f;

        [Header("Zoom Settings")]
        [SerializeField] private float zoomSpeed = 3.0f;
        [SerializeField] private float minDistance = 1.0f;
        [SerializeField] private float maxDistance = 10.0f;
        [SerializeField] private float defaultDistance = 3.5f;

        [Header("Auto-Turntable Rotation")]
        [SerializeField] private bool autoRotate = true;
        [SerializeField] private float autoRotateSpeed = 15.0f;

        [Header("Sub-Part Raycasting")]
        [SerializeField] private LayerMask modelLayerMask = ~0;

        // Internal tracking
        private float xDeg = 0.0f;
        private float yDeg = 20.0f;
        private float currentDistance;
        private float targetDistance;
        private Vector3 currentVelocity;
        private GameObject currentSpawnedModel;
        private ModelPartHighlighter currentHighlighter;

        private void Start()
        {
            if (pivotPoint == null)
            {
                GameObject pivotObj = new GameObject("Viewer_Pivot");
                pivotObj.transform.position = Vector3.zero;
                pivotPoint = pivotObj.transform;
            }

            if (modelSpawnAnchor == null)
            {
                modelSpawnAnchor = pivotPoint;
            }

            currentDistance = defaultDistance;
            targetDistance = defaultDistance;

            Vector3 angles = transform.eulerAngles;
            xDeg = angles.y;
            yDeg = angles.x;

            // Subscribe to model selection from GameManager
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnModelSelected += LoadModelForInspection;

                if (GameManager.Instance.SelectedModel != null)
                {
                    LoadModelForInspection(GameManager.Instance.SelectedModel);
                }
            }
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnModelSelected -= LoadModelForInspection;
            }
        }

        private void LateUpdate()
        {
            HandleInputs();
            UpdateCameraTransform();
        }

        /// <summary>
        /// Reads Touch and Mouse inputs for orbit, zoom, pan, and click selection.
        /// </summary>
        private void HandleInputs()
        {
            // Do not orbit camera if user clicked on a UI button/panel
            if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject())
            {
                return;
            }

            #if UNITY_EDITOR || UNITY_STANDALONE || UNITY_WEBGL
            HandleDesktopInput();
            #else
            HandleMobileTouchInput();
            #endif
        }

        private void HandleDesktopInput()
        {
            // Mouse Drag Orbit
            if (Input.GetMouseButton(0))
            {
                xDeg += Input.GetAxis("Mouse X") * xOrbitSpeed * 0.02f;
                yDeg -= Input.GetAxis("Mouse Y") * yOrbitSpeed * 0.02f;
                yDeg = ClampAngle(yDeg, yMinLimit, yMaxLimit);
                autoRotate = false; // Pause turntable on user interaction
            }
            else if (autoRotate)
            {
                xDeg += autoRotateSpeed * Time.deltaTime;
            }

            // Scroll Wheel Zoom
            float scroll = Input.GetAxis("Mouse ScrollWheel");
            if (Mathf.Abs(scroll) > 0.001f)
            {
                targetDistance -= scroll * zoomSpeed;
                targetDistance = Mathf.Clamp(targetDistance, minDistance, maxDistance);
            }

            // Click to Raycast Sub-parts
            if (Input.GetMouseButtonDown(0))
            {
                CheckPartRaycast(Input.mousePosition);
            }
        }

        private void HandleMobileTouchInput()
        {
            // 1-Finger Orbit
            if (Input.touchCount == 1)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Moved)
                {
                    xDeg += touch.deltaPosition.x * xOrbitSpeed * 0.002f;
                    yDeg -= touch.deltaPosition.y * yOrbitSpeed * 0.002f;
                    yDeg = ClampAngle(yDeg, yMinLimit, yMaxLimit);
                    autoRotate = false;
                }
                else if (touch.phase == TouchPhase.Ended && touch.tapCount == 1)
                {
                    CheckPartRaycast(touch.position);
                }
            }
            // 2-Finger Pinch Zoom
            else if (Input.touchCount == 2)
            {
                Touch touch0 = Input.GetTouch(0);
                Touch touch1 = Input.GetTouch(1);

                Vector2 prevPos0 = touch0.position - touch0.deltaPosition;
                Vector2 prevPos1 = touch1.position - touch1.deltaPosition;

                float prevDistance = (prevPos0 - prevPos1).magnitude;
                float currentTouchDistance = (touch0.position - touch1.position).magnitude;

                float deltaDistance = prevDistance - currentTouchDistance;
                targetDistance += deltaDistance * 0.005f * zoomSpeed;
                targetDistance = Mathf.Clamp(targetDistance, minDistance, maxDistance);
            }
            else if (autoRotate)
            {
                xDeg += autoRotateSpeed * Time.deltaTime;
            }
        }

        private void UpdateCameraTransform()
        {
            currentDistance = Mathf.Lerp(currentDistance, targetDistance, Time.deltaTime * 8.0f);
            Quaternion rotation = Quaternion.Euler(yDeg, xDeg, 0);
            Vector3 position = rotation * new Vector3(0.0f, 0.0f, -currentDistance) + pivotPoint.position;

            transform.rotation = rotation;
            transform.position = position;
        }

        /// <summary>
        /// Instantiates the target 3D model at the spawn anchor.
        /// </summary>
        public void LoadModelForInspection(EducationalModelData modelData)
        {
            if (modelData == null || modelData.prefab == null) return;

            if (currentSpawnedModel != null)
            {
                Destroy(currentSpawnedModel);
            }

            currentSpawnedModel = Instantiate(modelData.prefab, modelSpawnAnchor);
            currentSpawnedModel.transform.localPosition = Vector3.zero;
            currentSpawnedModel.transform.localRotation = Quaternion.Euler(modelData.defaultRotationOffset);
            currentSpawnedModel.transform.localScale = Vector3.one * modelData.recommendedViewerScale;

            currentHighlighter = currentSpawnedModel.GetComponent<ModelPartHighlighter>();
            if (currentHighlighter == null)
            {
                currentHighlighter = currentSpawnedModel.AddComponent<ModelPartHighlighter>();
            }

            ResetCameraView();
            Debug.Log($"[ModelInspectorController] Loaded model: {modelData.titleEnglish}");
        }

        /// <summary>
        /// Raycasts from screen position onto 3D model colliders to inspect parts.
        /// </summary>
        private void CheckPartRaycast(Vector2 screenPosition)
        {
            Ray ray = Camera.main.ScreenPointToRay(screenPosition);
            if (Physics.Raycast(ray, out RaycastHit hit, 100f, modelLayerMask))
            {
                string hitName = hit.collider.gameObject.name;
                Debug.Log($"[ModelInspectorController] Interacted with part: {hitName}");

                if (currentHighlighter != null)
                {
                    currentHighlighter.HighlightPart(hitName, Color.cyan);
                }

                if (SoundManager.Instance != null)
                {
                    SoundManager.Instance.PlayModelInspectSound();
                }
            }
        }

        /// <summary>
        /// Toggles turntable rotation on/off.
        /// </summary>
        public void ToggleAutoRotate(bool enabled)
        {
            autoRotate = enabled;
        }

        /// <summary>
        /// Resets the camera orientation and zoom distance back to default.
        /// </summary>
        public void ResetCameraView()
        {
            xDeg = 0.0f;
            yDeg = 20.0f;
            targetDistance = defaultDistance;
            currentDistance = defaultDistance;

            if (currentHighlighter != null)
            {
                currentHighlighter.ResetAllHighlights();
            }
        }

        private static float ClampAngle(float angle, float min, float max)
        {
            if (angle < -360F) angle += 360F;
            if (angle > 360F) angle -= 360F;
            return Mathf.Clamp(angle, min, max);
        }
    }
}
