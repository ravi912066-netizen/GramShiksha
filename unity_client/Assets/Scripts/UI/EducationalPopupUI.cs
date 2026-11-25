using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using GramSikha.Core;
using GramSikha.Data;

namespace GramSikha.UI
{
    /// <summary>
    /// Displays educational metadata, multilingual descriptions, historical context,
    /// key facts, and audio voiceover narration for any selected 3D village model.
    /// </summary>
    public class EducationalPopupUI : MonoBehaviour
    {
        [Header("UI Panel Root")]
        [SerializeField] private GameObject panelRoot;

        [Header("Header Elements")]
        [SerializeField] private Image modelIcon;
        [SerializeField] private TextMeshProUGUI titleText;
        [SerializeField] private TextMeshProUGUI categoryBadgeText;

        [Header("Content Elements")]
        [SerializeField] private TextMeshProUGUI descriptionText;
        [SerializeField] private TextMeshProUGUI keyFactsText;
        [SerializeField] private TextMeshProUGUI historyText;
        [SerializeField] private TextMeshProUGUI utilityText;

        [Header("Audio Narration Controls")]
        [SerializeField] private Button playAudioButton;
        [SerializeField] private Button pauseAudioButton;
        [SerializeField] private TextMeshProUGUI audioButtonLabel;

        [Header("Localization Toggle")]
        [SerializeField] private Button languageToggleButton;
        [SerializeField] private TextMeshProUGUI languageButtonText;

        [Header("Close Button")]
        [SerializeField] private Button closeButton;

        private EducationalModelData currentModel;

        private void Awake()
        {
            if (panelRoot == null) panelRoot = gameObject;

            if (closeButton != null)
                closeButton.onClick.AddListener(ClosePanel);

            if (playAudioButton != null)
                playAudioButton.onClick.AddListener(ToggleAudioNarration);

            if (languageToggleButton != null)
                languageToggleButton.onClick.AddListener(OnLanguageButtonClicked);
        }

        private void Start()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnModelSelected += DisplayModel;
                GameManager.Instance.OnLanguageChanged += HandleLanguageChanged;
                GameManager.Instance.OnEducationalPanelRequested += SetPanelActive;

                if (GameManager.Instance.SelectedModel != null)
                {
                    DisplayModel(GameManager.Instance.SelectedModel);
                }
            }

            UpdateLanguageButtonLabel();
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnModelSelected -= DisplayModel;
                GameManager.Instance.OnLanguageChanged -= HandleLanguageChanged;
                GameManager.Instance.OnEducationalPanelRequested -= SetPanelActive;
            }
        }

        public void DisplayModel(EducationalModelData modelData)
        {
            if (modelData == null) return;
            currentModel = modelData;
            RefreshUI();
            SetPanelActive(true);
        }

        public void RefreshUI()
        {
            if (currentModel == null) return;

            LanguageMode lang = GameManager.Instance != null ? GameManager.Instance.CurrentLanguage : LanguageMode.English;

            if (modelIcon != null && currentModel.thumbnailIcon != null)
            {
                modelIcon.sprite = currentModel.thumbnailIcon;
            }

            if (titleText != null)
            {
                titleText.text = currentModel.GetLocalizedTitle(lang);
            }

            if (categoryBadgeText != null)
            {
                categoryBadgeText.text = currentModel.category.ToString().ToUpper();
            }

            if (descriptionText != null)
            {
                descriptionText.text = currentModel.GetLocalizedDescription(lang);
            }

            if (keyFactsText != null)
            {
                List<string> facts = currentModel.GetLocalizedKeyFacts(lang);
                if (facts != null && facts.Count > 0)
                {
                    keyFactsText.text = "• " + string.Join("\n• ", facts);
                }
                else
                {
                    keyFactsText.text = string.Empty;
                }
            }

            if (historyText != null)
            {
                historyText.text = currentModel.GetLocalizedHistory(lang);
            }

            if (utilityText != null)
            {
                utilityText.text = currentModel.GetLocalizedUtility(lang);
            }

            UpdateLanguageButtonLabel();
        }

        private void ToggleAudioNarration()
        {
            if (SoundManager.Instance == null || currentModel == null) return;

            if (SoundManager.Instance.IsNarrationPlaying())
            {
                SoundManager.Instance.PauseNarration();
                if (audioButtonLabel != null) audioButtonLabel.text = "▶ Play Voiceover";
            }
            else
            {
                LanguageMode lang = GameManager.Instance != null ? GameManager.Instance.CurrentLanguage : LanguageMode.English;
                AudioClip clip = currentModel.GetLocalizedNarration(lang);
                if (clip != null)
                {
                    SoundManager.Instance.PlayNarration(clip);
                    if (audioButtonLabel != null) audioButtonLabel.text = "⏸ Pause Voiceover";
                }
            }
        }

        private void OnLanguageButtonClicked()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.ToggleLanguage();
            }
        }

        private void HandleLanguageChanged(LanguageMode newLang)
        {
            RefreshUI();
        }

        private void UpdateLanguageButtonLabel()
        {
            if (languageButtonText == null) return;
            LanguageMode lang = GameManager.Instance != null ? GameManager.Instance.CurrentLanguage : LanguageMode.English;
            languageButtonText.text = (lang == LanguageMode.English) ? "हिंदी (Hindi)" : "English";
        }

        public void SetPanelActive(bool active)
        {
            if (panelRoot != null)
            {
                panelRoot.SetActive(active);
            }
        }

        public void ClosePanel()
        {
            SetPanelActive(false);
            if (SoundManager.Instance != null)
            {
                SoundManager.Instance.StopNarration();
            }
        }
    }
}
