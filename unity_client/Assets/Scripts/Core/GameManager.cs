using System;
using UnityEngine;
using UnityEngine.SceneManagement;
using GramSikha.Data;

namespace GramSikha.Core
{
    /// <summary>
    /// Central manager for Gram Sikha application state, active educational model,
    /// language localization settings, and scene transitions.
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("Runtime State")]
        [SerializeField] private ExperienceMode currentMode = ExperienceMode.MainMenu;
        [SerializeField] private LanguageMode currentLanguage = LanguageMode.English;
        [SerializeField] private EducationalModelData selectedModel;

        [Header("Global Configuration")]
        [Tooltip("Available educational models loaded in catalog")]
        [SerializeField] private EducationalModelData[] allVillageModels;

        // Events for decoupled UI & XR systems
        public event Action<ExperienceMode> OnExperienceModeChanged;
        public event Action<LanguageMode> OnLanguageChanged;
        public event Action<EducationalModelData> OnModelSelected;
        public event Action<bool> OnEducationalPanelRequested;

        public ExperienceMode CurrentMode => currentMode;
        public LanguageMode CurrentLanguage => currentLanguage;
        public EducationalModelData SelectedModel => selectedModel;
        public EducationalModelData[] AllVillageModels => allVillageModels;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);

            // Load default models if not assigned in Inspector
            if (allVillageModels == null || allVillageModels.Length == 0)
            {
                allVillageModels = Resources.LoadAll<EducationalModelData>("EducationalData");
            }
        }

        /// <summary>
        /// Selects an educational model for inspection or AR/VR interaction.
        /// </summary>
        public void SelectModel(EducationalModelData model)
        {
            selectedModel = model;
            OnModelSelected?.Invoke(model);
        }

        /// <summary>
        /// Switches between English and Hindi content.
        /// </summary>
        public void SetLanguage(LanguageMode language)
        {
            if (currentLanguage == language) return;
            currentLanguage = language;
            OnLanguageChanged?.Invoke(language);
        }

        /// <summary>
        /// Toggles between English and Hindi.
        /// </summary>
        public void ToggleLanguage()
        {
            SetLanguage(currentLanguage == LanguageMode.English ? LanguageMode.Hindi : LanguageMode.English);
        }

        /// <summary>
        /// Request opening or closing educational info modal.
        /// </summary>
        public void ToggleEducationalPanel(bool isOpen)
        {
            OnEducationalPanelRequested?.Invoke(isOpen);
        }

        /// <summary>
        /// Transitions to a designated experience mode and loads its corresponding Unity scene.
        /// </summary>
        public void LoadExperience(ExperienceMode mode)
        {
            currentMode = mode;
            OnExperienceModeChanged?.Invoke(mode);

            string targetScene = mode switch
            {
                ExperienceMode.MainMenu => "MainMenu",
                ExperienceMode.ThreeDViewer => "Model_3D_Inspector",
                ExperienceMode.VirtualReality => "Village_VR_Tour",
                ExperienceMode.AugmentedReality => "AR_Model_Laboratory",
                _ => "MainMenu"
            };

            Debug.Log($"[GameManager] Loading scene: {targetScene} for mode: {mode}");
            SceneManager.LoadScene(targetScene);
        }

        /// <summary>
        /// Helper to return back to Main Menu from any active AR/VR/3D scene.
        /// </summary>
        public void ReturnToMainMenu()
        {
            LoadExperience(ExperienceMode.MainMenu);
        }
    }
}
