using UnityEngine;
using UnityEngine.XR.ARFoundation;

namespace GramSikha.AR
{
    /// <summary>
    /// Toggles detected AR Plane visualization lines and surfaces on or off
    /// to provide an uncluttered realistic view once the 3D village model is placed.
    /// </summary>
    public class ARPlaneVisualizerToggle : MonoBehaviour
    {
        [SerializeField] private ARPlaneManager planeManager;
        private bool isPlanesVisible = true;

        private void Awake()
        {
            if (planeManager == null)
            {
                planeManager = FindObjectOfType<ARPlaneManager>();
            }
        }

        public void TogglePlaneVisibility()
        {
            SetPlaneVisibility(!isPlanesVisible);
        }

        public void SetPlaneVisibility(bool visible)
        {
            isPlanesVisible = visible;

            if (planeManager == null) return;

            foreach (var plane in planeManager.trackables)
            {
                plane.gameObject.SetActive(visible);
            }

            // Also toggle plane detection component if user wants to freeze detection
            planeManager.enabled = visible;
        }
    }
}
