using UnityEngine;
using UnityEngine.EventSystems;

namespace GramSikha.AR
{
    /// <summary>
    /// Enables multi-touch mobile gestures on placed 3D models in Augmented Reality:
    /// - 1-Finger drag: Move model over ground plane
    /// - 2-Finger twist: Rotate model horizontally around Y axis
    /// - 2-Finger pinch: Uniform scale with clamp limits
    /// </summary>
    public class ARObjectManipulator : MonoBehaviour
    {
        [Header("Scale Limits")]
        [SerializeField] private float minScale = 0.05f;
        [SerializeField] private float maxScale = 2.0f;
        [SerializeField] private float pinchScaleSensitivity = 0.003f;

        [Header("Rotation Settings")]
        [SerializeField] private float rotationSensitivity = 0.4f;

        [Header("Position Movement")]
        [SerializeField] private bool allowDragReposition = true;
        [SerializeField] private float dragSensitivity = 0.002f;

        private Vector2 previousTouchPos0;
        private Vector2 previousTouchPos1;
        private bool isInteracting = false;

        private void Update()
        {
            // Avoid gesture manipulation if finger is touching a UI button
            if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject())
            {
                return;
            }

            #if UNITY_EDITOR
            HandleEditorInputs();
            #else
            HandleTouchGestures();
            #endif
        }

        private void HandleTouchGestures()
        {
            if (Input.touchCount == 1 && allowDragReposition)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Moved)
                {
                    Vector3 forward = Camera.main.transform.forward;
                    Vector3 right = Camera.main.transform.right;
                    forward.y = 0;
                    right.y = 0;
                    forward.Normalize();
                    right.Normalize();

                    Vector3 moveDelta = (right * touch.deltaPosition.x + forward * touch.deltaPosition.y) * dragSensitivity;
                    transform.position += moveDelta;
                }
            }
            else if (Input.touchCount == 2)
            {
                Touch t0 = Input.GetTouch(0);
                Touch t1 = Input.GetTouch(1);

                if (t0.phase == TouchPhase.Began || t1.phase == TouchPhase.Began)
                {
                    previousTouchPos0 = t0.position;
                    previousTouchPos1 = t1.position;
                    isInteracting = true;
                    return;
                }

                if (t0.phase == TouchPhase.Moved || t1.phase == TouchPhase.Moved)
                {
                    // 1. Pinch Scale
                    float prevTouchDistance = (previousTouchPos0 - previousTouchPos1).magnitude;
                    float currentTouchDistance = (t0.position - t1.position).magnitude;
                    float deltaDistance = currentTouchDistance - prevTouchDistance;

                    float scaleFactor = 1.0f + (deltaDistance * pinchScaleSensitivity);
                    Vector3 newScale = transform.localScale * scaleFactor;

                    // Clamp scale
                    float clampedX = Mathf.Clamp(newScale.x, minScale, maxScale);
                    transform.localScale = new Vector3(clampedX, clampedX, clampedX);

                    // 2. Twist Rotation
                    Vector2 prevVector = previousTouchPos0 - previousTouchPos1;
                    Vector2 currentVector = t0.position - t1.position;
                    float angleDelta = Vector2.SignedAngle(prevVector, currentVector);

                    transform.Rotate(Vector3.up, -angleDelta * rotationSensitivity, Space.World);

                    previousTouchPos0 = t0.position;
                    previousTouchPos1 = t1.position;
                }

                if (t0.phase == TouchPhase.Ended || t1.phase == TouchPhase.Ended)
                {
                    isInteracting = false;
                }
            }
        }

        #if UNITY_EDITOR
        private void HandleEditorInputs()
        {
            // Rotate model using Q and E keys in editor
            if (Input.GetKey(KeyCode.Q))
            {
                transform.Rotate(Vector3.up, 60f * Time.deltaTime, Space.World);
            }
            if (Input.GetKey(KeyCode.E))
            {
                transform.Rotate(Vector3.up, -60f * Time.deltaTime, Space.World);
            }

            // Scale model using Mouse Scroll Wheel
            float scroll = Input.GetAxis("Mouse ScrollWheel");
            if (Mathf.Abs(scroll) > 0.01f)
            {
                float newScaleVal = Mathf.Clamp(transform.localScale.x + scroll * 0.5f, minScale, maxScale);
                transform.localScale = Vector3.one * newScaleVal;
            }
        }
        #endif

        /// <summary>
        /// Resets the placed model to its recommended default scale and upright orientation.
        /// </summary>
        public void ResetTransformation(float defaultScale = 0.25f)
        {
            transform.localScale = Vector3.one * defaultScale;
            transform.rotation = Quaternion.identity;
        }
    }
}
