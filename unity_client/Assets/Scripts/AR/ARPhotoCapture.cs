using System.Collections;
using System.IO;
using UnityEngine;

namespace GramSikha.AR
{
    /// <summary>
    /// Captures mobile AR screenshots of the placed village models
    /// and saves them to the device storage gallery.
    /// </summary>
    public class ARPhotoCapture : MonoBehaviour
    {
        [SerializeField] private GameObject[] uiElementsToHideDuringCapture;

        public void TakeARPhoto()
        {
            StartCoroutine(CaptureRoutine());
        }

        private IEnumerator CaptureRoutine()
        {
            // Temporarily hide UI overlays
            ToggleUIVisibility(false);

            yield return new WaitForEndOfFrame();

            string timestamp = System.DateTime.Now.ToString("yyyyMMdd_HHmmss");
            string filename = $"GramSikha_AR_{timestamp}.png";
            string path = Path.Combine(Application.persistentDataPath, filename);

            ScreenCapture.CaptureScreenshot(filename);

            Debug.Log($"[ARPhotoCapture] Photo captured and saved to: {path}");

            yield return new WaitForSeconds(0.2f);

            // Restore UI overlays
            ToggleUIVisibility(true);
        }

        private void ToggleUIVisibility(bool visible)
        {
            if (uiElementsToHideDuringCapture == null) return;
            foreach (var go in uiElementsToHideDuringCapture)
            {
                if (go != null) go.SetActive(visible);
            }
        }
    }
}
