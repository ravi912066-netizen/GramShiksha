using System;
using UnityEngine;
using TMPro;
using GramSikha.Core;
using GramSikha.Data;

namespace GramSikha.VR
{
    /// <summary>
    /// Attach this script to any 3D village model GameObject in the VR scene.
    /// Interacts with XR Ray Interactors and XR Direct Interactors.
    /// Displays a floating VR educational card and triggers audio narration.
    /// </summary>
    [RequireComponent(typeof(Collider))]
    public class VREducationalInteractable : MonoBehaviour
    {
        [Header("Educational Content")]
        [Tooltip("The ScriptableObject containing educational data for this village object")]
        [SerializeField] private EducationalModelData educationalData;

        [Header("VR Info Card Prefab")]
        [Tooltip("Floating World-Space Canvas showing model title and learning points")]
        [SerializeField] private GameObject floatingCanvasPrefab;
        [SerializeField] private Vector3 canvasOffset = new Vector3(0, 2.2f, 0);

        [Header("Visual Feedback on Hover")]
        [SerializeField] private Color hoverHighlightColor = new Color(0.3f, 0.8f, 1f, 1f);
        [SerializeField] private Renderer targetRenderer;

        // Runtime state
        private GameObject spawnedCanvasInstance;
        private TextMeshProUGUI titleText;
        private TextMeshProUGUI descriptionText;
        private Color originalColor = Color.white;
        private bool isHovered = false;
        private bool isCardOpen = false;

        private void Awake()
        {
            if (targetRenderer == null)
            {
                targetRenderer = GetComponentInChildren<Renderer>();
            }

            if (targetRenderer != null && targetRenderer.material != null && targetRenderer.material.HasProperty("_Color"))
            {
                originalColor = targetRenderer.material.color;
            }
        }

        private void Start()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnLanguageChanged += HandleLanguageChanged;
            }
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnLanguageChanged -= HandleLanguageChanged;
            }

            if (spawnedCanvasInstance != null)
            {
                Destroy(spawnedCanvasInstance);
            }
        }

        /// <summary>
        /// Called when VR Controller ray hovers over this village object.
        /// (Can be hooked to XRSimpleInteractable.firstHoverEntered event)
        /// </summary>
        public void OnVRHoverEnter()
        {
            isHovered = true;
            ApplyHighlight(hoverHighlightColor);
        }

        /// <summary>
        /// Called when VR Controller ray leaves this village object.
        /// (Can be hooked to XRSimpleInteractable.lastHoverExited event)
        /// </summary>
        public void OnVRHoverExit()
        {
            isHovered = false;
            ApplyHighlight(originalColor);
        }

        /// <summary>
        /// Called when VR user clicks the trigger or grip button on this object.
        /// (Can be hooked to XRSimpleInteractable.selectEntered event)
        /// </summary>
        public void OnVRSelect()
        {
            ToggleEducationalCard();
        }

        public void ToggleEducationalCard()
        {
            isCardOpen = !isCardOpen;

            if (isCardOpen)
            {
                ShowEducationalCard();
            }
            else
            {
                HideEducationalCard();
            }
        }

        private void ShowEducationalCard()
        {
            if (spawnedCanvasInstance == null)
            {
                if (floatingCanvasPrefab != null)
                {
                    spawnedCanvasInstance = Instantiate(floatingCanvasPrefab, transform.position + canvasOffset, Quaternion.identity);
                }
                else
                {
                    spawnedCanvasInstance = CreateFallbackVRFloatingCanvas();
                }
            }

            spawnedCanvasInstance.transform.position = transform.position + canvasOffset;
            spawnedCanvasInstance.SetActive(true);

            UpdateCanvasText();

            // Play voiceover narration
            if (educationalData != null && SoundManager.Instance != null)
            {
                LanguageMode lang = GameManager.Instance != null ? GameManager.Instance.CurrentLanguage : LanguageMode.English;
                AudioClip narration = educationalData.GetLocalizedNarration(lang);
                if (narration != null)
                {
                    SoundManager.Instance.PlayNarration(narration);
                }
                else
                {
                    SoundManager.Instance.PlayModelInspectSound();
                }
            }
        }

        private void HideEducationalCard()
        {
            if (spawnedCanvasInstance != null)
            {
                spawnedCanvasInstance.SetActive(false);
            }

            if (SoundManager.Instance != null)
            {
                SoundManager.Instance.StopNarration();
            }
        }

        private void HandleLanguageChanged(LanguageMode newLang)
        {
            if (isCardOpen)
            {
                UpdateCanvasText();
            }
        }

        private void UpdateCanvasText()
        {
            if (educationalData == null) return;

            LanguageMode lang = GameManager.Instance != null ? GameManager.Instance.CurrentLanguage : LanguageMode.English;

            if (titleText != null)
            {
                titleText.text = educationalData.GetLocalizedTitle(lang);
            }

            if (descriptionText != null)
            {
                string desc = educationalData.GetLocalizedDescription(lang);
                var facts = educationalData.GetLocalizedKeyFacts(lang);
                if (facts != null && facts.Count > 0)
                {
                    desc += "\n\n• " + string.Join("\n• ", facts);
                }
                descriptionText.text = desc;
            }
        }

        private void ApplyHighlight(Color color)
        {
            if (targetRenderer != null && targetRenderer.material != null && targetRenderer.material.HasProperty("_Color"))
            {
                targetRenderer.material.color = color;
            }
        }

        /// <summary>
        /// Creates a clean procedural VR World-Space Canvas if no prefab was assigned in Inspector.
        /// </summary>
        private GameObject CreateFallbackVRFloatingCanvas()
        {
            GameObject canvasGo = new GameObject("VR_Floating_InfoCard");
            Canvas canvas = canvasGo.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.WorldSpace;
            canvasGo.transform.localScale = Vector3.one * 0.0025f;

            canvasGo.AddComponent<VRWorldSpaceCanvasFacing>();

            RectTransform canvasRect = canvasGo.GetComponent<RectTransform>();
            canvasRect.sizeDelta = new Vector2(500, 320);

            // Background Panel
            GameObject bgGo = new GameObject("Background_Panel");
            bgGo.transform.SetParent(canvasGo.transform, false);
            var bgImage = bgGo.AddComponent<UnityEngine.UI.Image>();
            bgImage.color = new Color(0.08f, 0.12f, 0.18f, 0.92f);
            RectTransform bgRect = bgGo.GetComponent<RectTransform>();
            bgRect.anchorMin = Vector2.zero;
            bgRect.anchorMax = Vector2.one;
            bgRect.sizeDelta = Vector2.zero;

            // Title Text
            GameObject titleGo = new GameObject("Title_Text");
            titleGo.transform.SetParent(canvasGo.transform, false);
            titleText = titleGo.AddComponent<TextMeshProUGUI>();
            titleText.fontSize = 28;
            titleText.fontStyle = FontStyles.Bold;
            titleText.color = new Color(1f, 0.85f, 0.3f);
            titleText.alignment = TextAlignmentOptions.Center;
            RectTransform titleRect = titleGo.GetComponent<RectTransform>();
            titleRect.anchoredPosition = new Vector2(0, 110);
            titleRect.sizeDelta = new Vector2(460, 50);

            // Description Text
            GameObject descGo = new GameObject("Desc_Text");
            descGo.transform.SetParent(canvasGo.transform, false);
            descriptionText = descGo.AddComponent<TextMeshProUGUI>();
            descriptionText.fontSize = 18;
            descriptionText.color = Color.white;
            descriptionText.enableWordWrapping = true;
            RectTransform descRect = descGo.GetComponent<RectTransform>();
            descRect.anchoredPosition = new Vector2(0, -20);
            descRect.sizeDelta = new Vector2(460, 200);

            return canvasGo;
        }
    }
}
