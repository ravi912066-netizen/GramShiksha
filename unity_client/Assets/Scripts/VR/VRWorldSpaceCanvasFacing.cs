using UnityEngine;

namespace GramSikha.VR
{
    /// <summary>
    /// Smoothly rotates and billboards a world-space UI canvas to always face
    /// the player's VR Headset / Main Camera.
    /// </summary>
    public class VRWorldSpaceCanvasFacing : MonoBehaviour
    {
        [Header("Target & Orientation")]
        [Tooltip("VR Headset Camera transform. If null, automatically binds to Camera.main")]
        [SerializeField] private Transform targetCamera;
        [SerializeField] private bool lockYAxis = true;
        [SerializeField] private float rotationSpeed = 6.0f;

        private void Start()
        {
            if (targetCamera == null && Camera.main != null)
            {
                targetCamera = Camera.main.transform;
            }
        }

        private void LateUpdate()
        {
            if (targetCamera == null)
            {
                if (Camera.main != null) targetCamera = Camera.main.transform;
                else return;
            }

            Vector3 directionToCamera = targetCamera.position - transform.position;

            if (lockYAxis)
            {
                directionToCamera.y = 0; // Keep canvas upright, avoiding awkward tilt
            }

            if (directionToCamera.sqrMagnitude > 0.001f)
            {
                Quaternion targetRotation = Quaternion.LookRotation(-directionToCamera);
                transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, Time.deltaTime * rotationSpeed);
            }
        }
    }
}
