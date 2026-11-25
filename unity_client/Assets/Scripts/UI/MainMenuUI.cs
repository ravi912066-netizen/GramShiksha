using UnityEngine;
using UnityEngine.UI;
using TMPro;
using GramSikha.Core;

namespace GramSikha.UI
{
    /// <summary>
    /// Manages the Main Menu user interface, mode transitions,
    /// language selection, and volume controls for Gram Sikha.
    /// </summary>
    public class MainMenuUI : MonoBehaviour
    {
        [Header("Mode Navigation Buttons")]
        [SerializeField] private Button vrTourButton;
        [SerializeField] private Button arLabButton;
        [SerializeField] private Button viewer3DButton;
        [SerializeField] private Button exitButton;

        [Header("Language Controls")]
        [SerializeField] private Button languageToggleButton;
        [SerializeField] private TextMeshProUGUI languageButtonText;

        [Header("Audio Settings")]
        [SerializeField] private Slider ambienceVolumeSlider;
        [SerializeField] private Button audioMuteButton;
        [SerializeField] private TextMeshProUGUI audioMuteText;

        [Header("Information Modal")]
        [SerializeField] private GameObject aboutModalGo;
        [SerializeField] private Button aboutButton;
        [SerializeField] private Button closeAboutButton;

        private bool isAudioMuted = false;

        private void Awake()
        {
            RegisterButtonCallbacks();
        }

        private void Start()
        {
            UpdateLanguageLabels();

            if (ambienceVolumeSlider != null)
            {
                ambienceVolumeSlider.value = 0.5f;
                ambienceVolumeSlider.onValueChanged.AddListener(OnAmbienceSliderChanged);
            }
        }

        private void RegisterButtonCallbacks()
        {
            if (vrTourButton != null)
                vrTourButton.onClick.AddListener(() => OnModeButtonClicked(ExperienceMode.VirtualReality));

            if (arLabButton != null)
                arLabButton.onClick.AddListener(() => OnModeButtonClicked(ExperienceMode.AugmentedReality));

            if (viewer3DButton != null)
                viewer3DButton.onClick.AddListener(() => OnModeButtonClicked(ExperienceMode.ThreeDViewer));

            if (languageToggleButton != null)
                languageToggleButton.onClick.AddListener(OnToggleLanguage);

            if (audioMuteButton != null)
                audioMuteButton.onClick.AddListener(OnToggleAudioMute);

            if (aboutButton != null)
                aboutButton.onClick.AddListener(() => SetAboutModal(true));

            if (closeAboutButton != null)
                closeAboutButton.onClick.AddListener(() => SetAboutModal(false));

            if (exitButton != null)
                exitButton.onClick.AddListener(OnExitGame);
        }

        private void OnModeButtonClicked(ExperienceMode mode)
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            if (GameManager.Instance != null) GameManager.Instance.LoadExperience(mode);
        }

        private void OnToggleLanguage()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.ToggleLanguage();
                UpdateLanguageLabels();
            }
        }

        private void UpdateLanguageLabels()
        {
            if (languageButtonText == null) return;
            LanguageMode lang = GameManager.Instance != null ? GameManager.Instance.CurrentLanguage : LanguageMode.English;
            languageButtonText.text = (lang == LanguageMode.English) ? "🌐 Language: English" : "🌐 भाषा: हिंदी";
        }

        private void OnAmbienceSliderChanged(float val)
        {
            if (SoundManager.Instance != null)
            {
                SoundManager.Instance.SetAmbienceVolume(val);
            }
        }

        private void OnToggleAudioMute()
        {
            isAudioMuted = !isAudioMuted;
            AudioListener.pause = isAudioMuted;

            if (audioMuteText != null)
            {
                audioMuteText.text = isAudioMuted ? "🔇 Unmute Audio" : "🔊 Mute Audio";
            }
        }

        private void SetAboutModal(bool visible)
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            if (aboutModalGo != null) aboutModalGo.SetActive(visible);
        }

        private void OnExitGame()
        {
            Debug.Log("[MainMenuUI] Exiting Gram Sikha...");
            Application.Quit();

            #if UNITY_EDITOR
            UnityEditor.EditorApplication.isPlaying = false;
            #endif
        }
    }
}
