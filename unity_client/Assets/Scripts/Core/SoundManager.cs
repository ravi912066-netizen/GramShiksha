using UnityEngine;

namespace GramSikha.Core
{
    /// <summary>
    /// Audio manager providing background village ambience, educational voiceover narration,
    /// and spatial UI sound effects.
    /// </summary>
    public class SoundManager : MonoBehaviour
    {
        public static SoundManager Instance { get; private set; }

        [Header("Audio Sources")]
        [SerializeField] private AudioSource ambienceSource;
        [SerializeField] private AudioSource narrationSource;
        [SerializeField] private AudioSource sfxSource;

        [Header("Default Audio Clips")]
        [SerializeField] private AudioClip villageAmbienceClip;
        [SerializeField] private AudioClip buttonClickClip;
        [SerializeField] private AudioClip modelInspectClip;
        [SerializeField] private AudioClip arPlacedClip;

        [Header("Volume Levels (0.0 to 1.0)")]
        [Range(0f, 1f)] [SerializeField] private float ambienceVolume = 0.4f;
        [Range(0f, 1f)] [SerializeField] private float narrationVolume = 1.0f;
        [Range(0f, 1f)] [SerializeField] private float sfxVolume = 0.8f;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);

            InitializeAudioSources();
        }

        private void Start()
        {
            if (villageAmbienceClip != null && ambienceSource != null)
            {
                PlayAmbience(villageAmbienceClip);
            }
        }

        private void InitializeAudioSources()
        {
            if (ambienceSource == null)
            {
                ambienceSource = gameObject.AddComponent<AudioSource>();
                ambienceSource.loop = true;
                ambienceSource.playOnAwake = false;
                ambienceSource.spatialBlend = 0f; // 2D Stereo
            }

            if (narrationSource == null)
            {
                narrationSource = gameObject.AddComponent<AudioSource>();
                narrationSource.loop = false;
                narrationSource.playOnAwake = false;
                narrationSource.spatialBlend = 0f;
            }

            if (sfxSource == null)
            {
                sfxSource = gameObject.AddComponent<AudioSource>();
                sfxSource.loop = false;
                sfxSource.playOnAwake = false;
                sfxSource.spatialBlend = 0f;
            }

            UpdateVolumes();
        }

        public void PlayAmbience(AudioClip clip)
        {
            if (clip == null || ambienceSource == null) return;
            ambienceSource.clip = clip;
            ambienceSource.volume = ambienceVolume;
            ambienceSource.Play();
        }

        public void StopAmbience()
        {
            if (ambienceSource != null) ambienceSource.Stop();
        }

        public void PlayNarration(AudioClip clip)
        {
            if (clip == null || narrationSource == null) return;
            narrationSource.Stop();
            narrationSource.clip = clip;
            narrationSource.volume = narrationVolume;
            narrationSource.Play();
        }

        public void PauseNarration()
        {
            if (narrationSource != null && narrationSource.isPlaying)
            {
                narrationSource.Pause();
            }
        }

        public void ResumeNarration()
        {
            if (narrationSource != null && !narrationSource.isPlaying && narrationSource.clip != null)
            {
                narrationSource.UnPause();
            }
        }

        public void StopNarration()
        {
            if (narrationSource != null)
            {
                narrationSource.Stop();
            }
        }

        public bool IsNarrationPlaying()
        {
            return narrationSource != null && narrationSource.isPlaying;
        }

        public void PlaySFX(AudioClip clip)
        {
            if (clip == null || sfxSource == null) return;
            sfxSource.PlayOneShot(clip, sfxVolume);
        }

        public void PlayButtonClick()
        {
            PlaySFX(buttonClickClip);
        }

        public void PlayModelInspectSound()
        {
            PlaySFX(modelInspectClip);
        }

        public void PlayARPlacedSound()
        {
            PlaySFX(arPlacedClip);
        }

        public void SetAmbienceVolume(float vol)
        {
            ambienceVolume = Mathf.Clamp01(vol);
            if (ambienceSource != null) ambienceSource.volume = ambienceVolume;
        }

        public void SetNarrationVolume(float vol)
        {
            narrationVolume = Mathf.Clamp01(vol);
            if (narrationSource != null) narrationSource.volume = narrationVolume;
        }

        public void SetSFXVolume(float vol)
        {
            sfxVolume = Mathf.Clamp01(vol);
        }

        private void UpdateVolumes()
        {
            if (ambienceSource != null) ambienceSource.volume = ambienceVolume;
            if (narrationSource != null) narrationSource.volume = narrationVolume;
        }
    }
}
