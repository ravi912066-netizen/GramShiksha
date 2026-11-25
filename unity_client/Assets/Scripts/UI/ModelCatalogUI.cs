using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using GramSikha.Core;
using GramSikha.Data;

namespace GramSikha.UI
{
    /// <summary>
    /// Displays a grid catalog of all interactive village 3D models.
    /// Supports category filtering and single-click model selection.
    /// </summary>
    public class ModelCatalogUI : MonoBehaviour
    {
        [Header("Catalog Container")]
        [Tooltip("Transform with GridLayoutGroup or VerticalLayoutGroup")]
        [SerializeField] private Transform cardContainer;
        [SerializeField] private GameObject modelCardPrefab;

        [Header("Category Filters")]
        [SerializeField] private Button filterAllButton;
        [SerializeField] private Button filterHousingButton;
        [SerializeField] private Button filterAgriButton;
        [SerializeField] private Button filterWaterButton;
        [SerializeField] private Button filterEduButton;

        private readonly List<GameObject> activeCards = new List<GameObject>();

        private void Start()
        {
            SetupFilterButtons();
            PopulateCatalog(null); // All models
        }

        private void SetupFilterButtons()
        {
            if (filterAllButton != null) filterAllButton.onClick.AddListener(() => PopulateCatalog(null));
            if (filterHousingButton != null) filterHousingButton.onClick.AddListener(() => PopulateCatalog(ModelCategory.Housing));
            if (filterAgriButton != null) filterAgriButton.onClick.AddListener(() => PopulateCatalog(ModelCategory.Agriculture));
            if (filterWaterButton != null) filterWaterButton.onClick.AddListener(() => PopulateCatalog(ModelCategory.WaterResource));
            if (filterEduButton != null) filterEduButton.onClick.AddListener(() => PopulateCatalog(ModelCategory.Education));
        }

        /// <summary>
        /// Populates the catalog UI with model cards, filtered by optional category.
        /// </summary>
        public void PopulateCatalog(ModelCategory? categoryFilter)
        {
            ClearCards();

            if (GameManager.Instance == null || GameManager.Instance.AllVillageModels == null) return;

            LanguageMode lang = GameManager.Instance.CurrentLanguage;

            foreach (var modelData in GameManager.Instance.AllVillageModels)
            {
                if (modelData == null) continue;

                if (categoryFilter.HasValue && modelData.category != categoryFilter.Value)
                    continue;

                GameObject cardGo;
                if (modelCardPrefab != null)
                {
                    cardGo = Instantiate(modelCardPrefab, cardContainer);
                }
                else
                {
                    cardGo = CreateDefaultCard(modelData, lang);
                }

                BindCardEvents(cardGo, modelData);
                activeCards.Add(cardGo);
            }
        }

        private void BindCardEvents(GameObject cardGo, EducationalModelData modelData)
        {
            Button btn = cardGo.GetComponent<Button>() ?? cardGo.GetComponentInChildren<Button>();
            if (btn != null)
            {
                btn.onClick.AddListener(() =>
                {
                    if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
                    if (GameManager.Instance != null) GameManager.Instance.SelectModel(modelData);
                });
            }
        }

        private void ClearCards()
        {
            foreach (var card in activeCards)
            {
                if (card != null) Destroy(card);
            }
            activeCards.Clear();
        }

        private GameObject CreateDefaultCard(EducationalModelData data, LanguageMode lang)
        {
            GameObject card = new GameObject($"Card_{data.modelId}");
            card.transform.SetParent(cardContainer, false);

            var image = card.AddComponent<Image>();
            image.color = new Color(0.12f, 0.16f, 0.22f, 0.95f);

            var button = card.AddComponent<Button>();
            ColorBlock cb = button.colors;
            cb.highlightedColor = new Color(0.2f, 0.35f, 0.5f, 1f);
            button.colors = cb;

            var layout = card.AddComponent<LayoutElement>();
            layout.minHeight = 80;
            layout.preferredHeight = 80;

            // Card Title Text
            GameObject textGo = new GameObject("Card_Title");
            textGo.transform.SetParent(card.transform, false);
            var tmp = textGo.AddComponent<TextMeshProUGUI>();
            tmp.text = $"{data.GetLocalizedTitle(lang)}\n<size=12><color=#FFD54F>[{data.category}]</color></size>";
            tmp.fontSize = 16;
            tmp.fontStyle = FontStyles.Bold;
            tmp.color = Color.white;
            tmp.alignment = TextAlignmentOptions.MidlineLeft;

            RectTransform rect = textGo.GetComponent<RectTransform>();
            rect.anchorMin = new Vector2(0.05f, 0.1f);
            rect.anchorMax = new Vector2(0.95f, 0.9f);
            rect.sizeDelta = Vector2.zero;

            return card;
        }
    }
}
