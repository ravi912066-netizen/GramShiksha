using System;
using System.Collections.Generic;
using UnityEngine;
using GramSikha.Core;

namespace GramSikha.Data
{
    [Serializable]
    public class ModelSubPart
    {
        [Tooltip("Identifier name of the sub-part (must match child Transform name)")]
        public string partName;

        [Tooltip("Educational description of this part in English")]
        [TextArea(2, 4)]
        public string descriptionEnglish;

        [Tooltip("Educational description of this part in Hindi")]
        [TextArea(2, 4)]
        public string descriptionHindi;

        [Tooltip("Color tint when this sub-part is highlighted during inspection")]
        public Color highlightColor = Color.yellow;
    }

    /// <summary>
    /// ScriptableObject defining educational metadata, descriptions, audio narrations,
    /// and interactive parts for every 3D village model in Gram Sikha.
    /// </summary>
    [CreateAssetMenu(fileName = "NewEducationalModel", menuName = "GramSikha/Educational Model Data", order = 1)]
    public class EducationalModelData : ScriptableObject
    {
        [Header("Model Identification")]
        public string modelId;
        public string titleEnglish;
        public string titleHindi;
        public ModelCategory category;
        public Sprite thumbnailIcon;

        [Header("3D Prefab Reference")]
        [Tooltip("The actual 3D visual prefab instantiated in AR, VR, or 3D Viewer")]
        public GameObject prefab;

        [Header("Educational Information (English)")]
        [TextArea(3, 6)]
        public string descriptionEnglish;
        [TextArea(2, 4)]
        public string historicalSignificanceEn;
        [TextArea(2, 4)]
        public string practicalUtilityEn;

        [Header("Educational Information (Hindi)")]
        [TextArea(3, 6)]
        public string descriptionHindi;
        [TextArea(2, 4)]
        public string historicalSignificanceHi;
        [TextArea(2, 4)]
        public string practicalUtilityHi;

        [Header("Key Facts & Learning Points")]
        public List<string> keyFactsEnglish = new List<string>();
        public List<string> keyFactsHindi = new List<string>();

        [Header("Interactive Sub-Components")]
        [Tooltip("List of specific inspectable parts (e.g., piston in hand pump, plow blade in tractor)")]
        public List<ModelSubPart> interactiveParts = new List<ModelSubPart>();

        [Header("Audio Narration & Sound FX")]
        public AudioClip narrationClipEnglish;
        public AudioClip narrationClipHindi;
        public AudioClip operationalSoundEffect;

        [Header("Model Transform Offsets")]
        [Tooltip("Default initial rotation in 3D viewer / AR placement")]
        public Vector3 defaultRotationOffset = Vector3.zero;
        [Tooltip("Recommended uniform scale for AR tabletop viewing")]
        public float recommendedARScale = 0.25f;
        [Tooltip("Recommended uniform scale for 3D viewer inspection")]
        public float recommendedViewerScale = 1.0f;

        /// <summary>
        /// Returns localized title based on active language.
        /// </summary>
        public string GetLocalizedTitle(LanguageMode lang)
        {
            return lang == LanguageMode.Hindi && !string.IsNullOrEmpty(titleHindi)
                ? titleHindi
                : titleEnglish;
        }

        /// <summary>
        /// Returns localized primary description based on active language.
        /// </summary>
        public string GetLocalizedDescription(LanguageMode lang)
        {
            return lang == LanguageMode.Hindi && !string.IsNullOrEmpty(descriptionHindi)
                ? descriptionHindi
                : descriptionEnglish;
        }

        /// <summary>
        /// Returns localized historical/cultural significance notes.
        /// </summary>
        public string GetLocalizedHistory(LanguageMode lang)
        {
            return lang == LanguageMode.Hindi && !string.IsNullOrEmpty(historicalSignificanceHi)
                ? historicalSignificanceHi
                : historicalSignificanceEn;
        }

        /// <summary>
        /// Returns localized practical/scientific utility notes.
        /// </summary>
        public string GetLocalizedUtility(LanguageMode lang)
        {
            return lang == LanguageMode.Hindi && !string.IsNullOrEmpty(practicalUtilityHi)
                ? practicalUtilityHi
                : practicalUtilityEn;
        }

        /// <summary>
        /// Returns key bullet points for educational cards.
        /// </summary>
        public List<string> GetLocalizedKeyFacts(LanguageMode lang)
        {
            if (lang == LanguageMode.Hindi && keyFactsHindi != null && keyFactsHindi.Count > 0)
            {
                return keyFactsHindi;
            }
            return keyFactsEnglish;
        }

        /// <summary>
        /// Returns audio narration clip matching selected language.
        /// </summary>
        public AudioClip GetLocalizedNarration(LanguageMode lang)
        {
            return lang == LanguageMode.Hindi && narrationClipHindi != null
                ? narrationClipHindi
                : narrationClipEnglish;
        }
    }
}
