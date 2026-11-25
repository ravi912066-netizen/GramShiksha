using UnityEngine;

namespace GramSikha.VR
{
    /// <summary>
    /// Manages the VR Exploration Rig (XR Origin), locomotion modes (teleportation vs continuous walk),
    /// comfort settings (tunneling vignette), and desktop simulator fallback for Editor testing.
    /// </summary>
    public class VRExplorationRig : MonoBehaviour
    {
        [Header("XR Rig Components")]
        [Tooltip("Child transform containing Main Camera / VR Headset")]
        [SerializeField] private Transform headCameraTransform;
        [Tooltip("Left Hand Controller / Ray Interactor")]
        [SerializeField] private Transform leftHandAnchor;
        [Tooltip("Right Hand Controller / Ray Interactor")]
        [SerializeField] private Transform rightHandAnchor;

        [Header("Locomotion Configuration")]
        [SerializeField] private bool allowContinuousMovement = true;
        [SerializeField] private bool allowTeleportation = true;
        [SerializeField] private float moveSpeed = 2.5f;
        [SerializeField] private float snapTurnAngle = 45f;
        [SerializeField] private bool enableComfortVignette = true;

        [Header("Desktop Simulator Controls (Editor Fallback)")]
        [Tooltip("Enables WASD movement and Mouse Look in Editor when no VR Headset is connected")]
        [SerializeField] private bool enableEditorSimulator = true;
        [SerializeField] private float mouseSensitivity = 2.0f;

        private CharacterController characterController;
        private float verticalVelocity = 0f;
        private float simYaw = 0f;
        private float simPitch = 0f;

        private void Awake()
        {
            characterController = GetComponent<CharacterController>();
            if (characterController == null)
            {
                characterController = gameObject.AddComponent<CharacterController>();
                characterController.height = 1.8f;
                characterController.radius = 0.35f;
                characterController.center = new Vector3(0, 0.9f, 0);
            }

            if (headCameraTransform == null && Camera.main != null)
            {
                headCameraTransform = Camera.main.transform;
            }
        }

        private void Update()
        {
            #if UNITY_EDITOR
            if (enableEditorSimulator)
            {
                HandleEditorSimulatorControls();
                return;
            }
            #endif

            HandleGravityAndMovement();
        }

        private void HandleGravityAndMovement()
        {
            if (characterController == null) return;

            // Basic gravity
            if (characterController.isGrounded)
            {
                verticalVelocity = -0.5f;
            }
            else
            {
                verticalVelocity += Physics.gravity.y * Time.deltaTime;
            }

            Vector3 move = new Vector3(0, verticalVelocity, 0);
            characterController.Move(move * Time.deltaTime);
        }

        #if UNITY_EDITOR
        private void HandleEditorSimulatorControls()
        {
            // Mouse Look in Editor
            if (Input.GetMouseButton(1)) // Right click held
            {
                simYaw += Input.GetAxis("Mouse X") * mouseSensitivity;
                simPitch -= Input.GetAxis("Mouse Y") * mouseSensitivity;
                simPitch = Mathf.Clamp(simPitch, -80f, 80f);

                transform.rotation = Quaternion.Euler(0, simYaw, 0);
                if (headCameraTransform != null)
                {
                    headCameraTransform.localRotation = Quaternion.Euler(simPitch, 0, 0);
                }
            }

            // Keyboard Movement (WASD)
            float h = Input.GetAxis("Horizontal");
            float v = Input.GetAxis("Vertical");

            Vector3 moveDirection = (transform.forward * v + transform.right * h).normalized;

            if (characterController.isGrounded) verticalVelocity = -0.5f;
            else verticalVelocity += Physics.gravity.y * Time.deltaTime;

            Vector3 finalMove = (moveDirection * moveSpeed) + new Vector3(0, verticalVelocity, 0);
            characterController.Move(finalMove * Time.deltaTime);

            // Raycast interaction test with Left Click or 'E' key
            if (Input.GetKeyDown(KeyCode.E) || Input.GetMouseButtonDown(0))
            {
                SimulateVRRaycastSelect();
            }
        }

        private void SimulateVRRaycastSelect()
        {
            if (headCameraTransform == null) return;

            Ray ray = new Ray(headCameraTransform.position, headCameraTransform.forward);
            if (Physics.Raycast(ray, out RaycastHit hit, 5.0f))
            {
                VREducationalInteractable interactable = hit.collider.GetComponentInParent<VREducationalInteractable>();
                if (interactable != null)
                {
                    interactable.OnVRSelect();
                }
            }
        }
        #endif

        /// <summary>
        /// Recenter VR Player position to designated village origin.
        /// </summary>
        public void RecenterPlayer(Vector3 targetPosition, Quaternion targetRotation)
        {
            transform.position = targetPosition;
            transform.rotation = targetRotation;
        }

        public void SetLocomotionMode(bool continuous)
        {
            allowContinuousMovement = continuous;
            allowTeleportation = !continuous;
        }
    }
}
