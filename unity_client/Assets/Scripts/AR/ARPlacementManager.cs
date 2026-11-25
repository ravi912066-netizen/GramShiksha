using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;
using UnityEngine.EventSystems;
using GramSikha.Core;
using GramSikha.Data;

namespace GramSikha.AR
{
    /// <summary>
    /// Detects real-world horizontal surfaces using Unity AR Foundation ARRaycastManager,
    /// aligns an intuitive placement reticle indicator, and instantiates the selected
    /// village educational 3D model upon screen tap.
    /// </summary>
    public class ARPlacementManager : MonoBehaviour
    {
        [Header("AR Foundation Components")]
        [SerializeField] private ARRaycastManager arRaycastManager;
        [SerializeField] private ARPlaneManager arPlaneManager;

        [Header("Placement Reticle Indicator")]
        [Tooltip("Visual marker showing detected real-world ground position")]
        [SerializeField] private GameObject placementReticlePrefab;
        [SerializeField] private bool showReticleOnlyWhenValid = true;

        [Header("Default Model Fallback")]
        [SerializeField] private EducationalModelData defaultModelData;

        // Runtime state
        private GameObject spawnedReticle;
        private GameObject currentPlacedObject;
        private Pose placementPose;
        private bool isPlacementPoseValid = false;
        private static readonly List<ARRaycastHit> hits = new List<ARRaycastHit>();

        public bool HasPlacedObject => currentPlacedObject != null;

        private void Awake()
        {
            if (arRaycastManager == null)
            {
                arRaycastManager = FindObjectOfType<ARRaycastManager>();
            }

            if (arPlaneManager == null)
            {
                arPlaneManager = FindObjectOfType<ARPlaneManager>();
            }

            InitializeReticle();
        }

        private void InitializeReticle()
        {
            if (placementReticlePrefab != null)
            {
                spawnedReticle = Instantiate(placementReticlePrefab);
            }
            else
            {
                spawnedReticle = CreateProceduralReticle();
            }

            spawnedReticle.SetActive(false);
        }

        private void Update()
        {
            UpdatePlacementPose();
            UpdateReticleVisuals();
            HandlePlacementTouch();
        }

        /// <summary>
        /// Raycasts from screen center into physical environment via ARRaycastManager.
        /// </summary>
        private void UpdatePlacementPose()
        {
            Vector2 screenCenter = new Vector2(Screen.width * 0.5f, Screen.height * 0.5f);

            #if UNITY_EDITOR
            // Editor simulation: place on ground plane y = 0
            Ray ray = Camera.main.ScreenPointToRay(screenCenter);
            Plane groundPlane = new Plane(Vector3.up, Vector3.zero);
            if (groundPlane.Raycast(ray, out float enter))
            {
                placementPose = new Pose(ray.GetPoint(enter), Quaternion.identity);
                isPlacementPoseValid = true;
                return;
            }
            #else
            if (arRaycastManager != null && arRaycastManager.Raycast(screenCenter, hits, TrackableType.PlaneWithinPolygon))
            {
                isPlacementPoseValid = hits.Count > 0;
                if (isPlacementPoseValid)
                {
                    placementPose = hits[0].pose;

                    // Align rotation towards camera forward
                    Vector3 cameraForward = Camera.main.transform.forward;
                    Vector3 cameraBearing = new Vector3(cameraForward.x, 0, cameraForward.z).normalized;
                    placementPose.rotation = Quaternion.LookRotation(cameraBearing);
                }
            }
            else
            {
                isPlacementPoseValid = false;
            }
            #endif
        }

        private void UpdateReticleVisuals()
        {
            if (spawnedReticle == null) return;

            if (isPlacementPoseValid)
            {
                spawnedReticle.SetActive(true);
                spawnedReticle.transform.SetPositionAndRotation(placementPose.position, placementPose.rotation);
            }
            else if (showReticleOnlyWhenValid)
            {
                spawnedReticle.SetActive(false);
            }
        }

        private void HandlePlacementTouch()
        {
            if (!isPlacementPoseValid) return;

            #if UNITY_EDITOR
            if (Input.GetMouseButtonDown(0))
            {
                if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject()) return;
                PlaceOrRepositionObject();
            }
            #else
            if (Input.touchCount > 0)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Began)
                {
                    if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject(touch.fingerId)) return;
                    PlaceOrRepositionObject();
                }
            }
            #endif
        }

        /// <summary>
        /// Instantiates or relocates the chosen village educational 3D model.
        /// </summary>
        public void PlaceOrRepositionObject()
        {
            EducationalModelData activeData = GameManager.Instance != null && GameManager.Instance.SelectedModel != null
                ? GameManager.Instance.SelectedModel
                : defaultModelData;

            if (activeData == null || activeData.prefab == null)
            {
                Debug.LogWarning("[ARPlacementManager] No EducationalModelData or prefab available to place.");
                return;
            }

            if (currentPlacedObject == null)
            {
                currentPlacedObject = Instantiate(activeData.prefab, placementPose.position, placementPose.rotation);
                currentPlacedObject.transform.localScale = Vector3.one * activeData.recommendedARScale;

                // Ensure gesture manipulator component is attached
                if (currentPlacedObject.GetComponent<ARObjectManipulator>() == null)
                {
                    currentPlacedObject.AddComponent<ARObjectManipulator>();
                }
            }
            else
            {
                currentPlacedObject.transform.SetPositionAndRotation(placementPose.position, placementPose.rotation);
            }

            // Audio & UI triggers
            if (SoundManager.Instance != null)
            {
                SoundManager.Instance.PlayARPlacedSound();
            }

            if (GameManager.Instance != null)
            {
                GameManager.Instance.ToggleEducationalPanel(true);
            }

            Debug.Log($"[ARPlacementManager] Placed {activeData.titleEnglish} at {placementPose.position}");
        }

        /// <summary>
        /// Clears current placed AR object from the scene.
        /// </summary>
        public void ClearPlacedObject()
        {
            if (currentPlacedObject != null)
            {
                Destroy(currentPlacedObject);
                currentPlacedObject = null;
            }
        }

        private GameObject CreateProceduralReticle()
        {
            GameObject reticle = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            reticle.name = "AR_Placement_Reticle";
            reticle.transform.localScale = new Vector3(0.4f, 0.005f, 0.4f);

            var col = reticle.GetComponent<Collider>();
            if (col != null) Destroy(col);

            Renderer r = reticle.GetComponent<Renderer>();
            if (r != null)
            {
                Material mat = new Material(Shader.Find("Universal Render Pipeline/Unlit") ?? Shader.Find("Unlit/Color"));
                mat.color = new Color(0.2f, 0.9f, 0.4f, 0.6f);
                r.material = mat;
            }

            return reticle;
        }
    }
}
