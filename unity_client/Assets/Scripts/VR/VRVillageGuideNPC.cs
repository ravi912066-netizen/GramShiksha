using System.Collections.Generic;
using UnityEngine;
using TMPro;
using GramSikha.Core;

namespace GramSikha.VR
{
    [System.Serializable]
    public class VillageTourStop
    {
        public string stopNameEn;
        public string stopNameHi;
        public Transform stopTransform;
        [TextArea(2, 4)] public string guideSpeechEn;
        [TextArea(2, 4)] public string guideSpeechHi;
        public AudioClip voiceoverClip;
    }

    /// <summary>
    /// Interactive Village Elder / Teacher NPC located in the VR Village.
    /// Provides guided educational tours and greeting dialogues.
    /// </summary>
    public class VRVillageGuideNPC : MonoBehaviour
    {
        [Header("NPC Dialogues")]
        [TextArea(2, 4)]
        [SerializeField] private string welcomeSpeechEn = "Namaste! Welcome to Gram Sikha. Walk with me to discover our village's schools, agriculture, and water heritage.";
        [TextArea(2, 4)]
        [SerializeField] private string welcomeSpeechHi = "नमस्ते! ग्राम शिक्षा में आपका स्वागत है। आइए हमारे गाँव के स्कूल, खेती और जल संरक्षण को समझें।";

        [Header("Tour Stops")]
        [SerializeField] private List<VillageTourStop> tourStops = new List<VillageTourStop>();

        [Header("Proximity & Visuals")]
        [SerializeField] private float greetingDistance = 3.5f;
        [SerializeField] private TextMeshPro speechBubbleText;
        [SerializeField] private GameObject speechBubbleGo;

        private Transform playerTransform;
        private int currentTourIndex = 0;
        private bool hasGreeted = false;

        private void Start()
        {
            if (speechBubbleGo != null)
            {
                speechBubbleGo.SetActive(false);
            }
        }

        private void Update()
        {
            FindPlayerIfNeeded();
            CheckProximity();
        }

        private void FindPlayerIfNeeded()
        {
            if (playerTransform == null && Camera.main != null)
            {
                playerTransform = Camera.main.transform;
            }
        }

        private void CheckProximity()
        {
            if (playerTransform == null) return;

            float distance = Vector3.Distance(transform.position, playerTransform.position);

            if (distance <= greetingDistance)
            {
                // Face the player
                Vector3 lookDirection = playerTransform.position - transform.position;
                lookDirection.y = 0;
                if (lookDirection.sqrMagnitude > 0.01f)
                {
                    transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(lookDirection), Time.deltaTime * 3.0f);
                }

                if (!hasGreeted)
                {
                    GreetPlayer();
                }
            }
            else
            {
                if (hasGreeted && distance > greetingDistance + 1.5f)
                {
                    hasGreeted = false;
                    if (speechBubbleGo != null) speechBubbleGo.SetActive(false);
                }
            }
        }

        private void GreetPlayer()
        {
            hasGreeted = true;
            LanguageMode lang = GameManager.Instance != null ? GameManager.Instance.CurrentLanguage : LanguageMode.English;
            string speech = (lang == LanguageMode.Hindi) ? welcomeSpeechHi : welcomeSpeechEn;

            if (speechBubbleText != null)
            {
                speechBubbleText.text = speech;
            }

            if (speechBubbleGo != null)
            {
                speechBubbleGo.SetActive(true);
            }
        }

        /// <summary>
        /// Advances the guided tour to the next educational waypoint.
        /// </summary>
        public void ProceedToNextTourStop()
        {
            if (tourStops == null || tourStops.Count == 0) return;

            currentTourIndex = (currentTourIndex + 1) % tourStops.Count;
            VillageTourStop stop = tourStops[currentTourIndex];

            LanguageMode lang = GameManager.Instance != null ? GameManager.Instance.CurrentLanguage : LanguageMode.English;
            string stopSpeech = (lang == LanguageMode.Hindi) ? stop.guideSpeechHi : stop.guideSpeechEn;

            if (speechBubbleText != null)
            {
                speechBubbleText.text = stopSpeech;
            }

            if (stop.voiceoverClip != null && SoundManager.Instance != null)
            {
                SoundManager.Instance.PlayNarration(stop.voiceoverClip);
            }

            Debug.Log($"[VRVillageGuideNPC] Guide moved tour to stop: {stop.stopNameEn}");
        }
    }
}
