using UnityEngine;
using UnityEngine.UI;
using TMPro;
using GramSikha.Core;

namespace GramSikha.UI
{
    /// <summary>
    /// Global Heads-Up Display (HUD) overlay present across 3D Viewer, VR, and AR scenes.
    /// Provides Return-to-Menu navigation, language quick-toggle, and instructions popup.
    /// </summary>
    public class HUDManager : MonoBehaviour
    {
        [Header("Top Navigation")]
        [SerializeField] private Button backButton;
        [SerializeField] private TextMeshProUGUI sceneTitleText;
        [SerializeField] private Button languageButton;
        [SerializeField] private TextMeshProUGUI languageText;

        [Header("Help / Instructions Modal")]
        [SerializeField] private Button helpButton;
        [SerializeField] private GameObject helpModalGo;
        [SerializeField] private Button closeHelpButton;

        private void Awake()
        {
            if (backButton != null)
                backButton.onClick.AddListener(OnBackClicked);

            if (languageButton != null)
                languageButton.onClick.AddListener(OnLanguageClicked);

            if (helpButton != null)
                helpButton.onClick.AddListener(() => SetHelpModal(true));

            if (closeHelpButton != null)
                closeHelpButton.onClick.AddListener(() => SetHelpModal(false));
        }

        private void Start()
        {
            UpdateHUDVisuals();

            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnLanguageChanged += (l) => UpdateHUDVisuals();
            }
        }

        private void OnBackClicked()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            if (GameManager.Instance != null) GameManager.Instance.ReturnToMainMenu();
        }

        private void OnLanguageClicked()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.ToggleLanguage();
            }
        }

        private void SetHelpModal(bool open)
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            if (helpModalGo != null) helpModalGo.SetActive(open);
        }

        private void UpdateHUDVisuals()
        {
            LanguageMode lang = GameManager.Instance != null ? GameManager.Instance.CurrentLanguage : LanguageMode.English;

            if (languageText != null)
            {
                languageText.text = (lang == LanguageMode.English) ? "हिंदी" : "English";
            }

            if (sceneTitleText != null && GameManager.Instance != null)
            {
                sceneTitleText.text = GameManager.Instance.CurrentMode switch
                {
                    ExperienceMode.ThreeDViewer => (lang == LanguageMode.English ? "3D Model Inspector" : "3D मॉडल प्रदर्शक"),
                    ExperienceMode.VirtualReality => (lang == LanguageMode.English ? "VR Village Tour" : "वीआर ग्राम भ्रमण"),
                    ExperienceMode.AugmentedReality => (lang == LanguageMode.English ? "AR Village Laboratory" : "एआर ग्राम प्रयोगशाला"),
                    _ => "Gram Sikha"
                };
            }
        }
    }
}
