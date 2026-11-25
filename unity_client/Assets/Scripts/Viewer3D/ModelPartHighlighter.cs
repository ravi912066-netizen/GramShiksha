using System.Collections.Generic;
using UnityEngine;

namespace GramSikha.Viewer3D
{
    /// <summary>
    /// Handles highlighting and color tinting of specific sub-parts of a 3D village model
    /// when selected by the user for educational inspection.
    /// </summary>
    public class ModelPartHighlighter : MonoBehaviour
    {
        private class PartMaterialState
        {
            public Renderer renderer;
            public Color originalColor;
            public Material originalMaterial;
        }

        private readonly List<PartMaterialState> cachedStates = new List<PartMaterialState>();
        private Transform currentHighlightedTransform;

        private void Awake()
        {
            CacheOriginalRenderers();
        }

        /// <summary>
        /// Scans all child renderers and caches original color values.
        /// </summary>
        public void CacheOriginalRenderers()
        {
            cachedStates.Clear();
            Renderer[] renderers = GetComponentsInChildren<Renderer>();
            foreach (Renderer r in renderers)
            {
                if (r.material != null && r.material.HasProperty("_Color"))
                {
                    cachedStates.Add(new PartMaterialState
                    {
                        renderer = r,
                        originalColor = r.material.color,
                        originalMaterial = r.material
                    });
                }
            }
        }

        /// <summary>
        /// Highlights a specific sub-part of the model by name with the given color tint.
        /// </summary>
        public bool HighlightPart(string partName, Color highlightColor)
        {
            ResetAllHighlights();

            Transform targetPart = FindChildRecursive(transform, partName);
            if (targetPart == null)
            {
                Debug.LogWarning($"[ModelPartHighlighter] Part '{partName}' not found on {gameObject.name}");
                return false;
            }

            currentHighlightedTransform = targetPart;
            Renderer[] partRenderers = targetPart.GetComponentsInChildren<Renderer>();

            foreach (Renderer r in partRenderers)
            {
                if (r.material != null && r.material.HasProperty("_Color"))
                {
                    r.material.color = highlightColor;
                }
            }

            return true;
        }

        /// <summary>
        /// Reverts all tinted parts back to their original material colors.
        /// </summary>
        public void ResetAllHighlights()
        {
            foreach (var state in cachedStates)
            {
                if (state.renderer != null && state.renderer.material != null && state.renderer.material.HasProperty("_Color"))
                {
                    state.renderer.material.color = state.originalColor;
                }
            }
            currentHighlightedTransform = null;
        }

        private Transform FindChildRecursive(Transform parent, string targetName)
        {
            if (parent.name.Equals(targetName, System.StringComparison.OrdinalIgnoreCase))
                return parent;

            for (int i = 0; i < parent.childCount; i++)
            {
                Transform found = FindChildRecursive(parent.GetChild(i), targetName);
                if (found != null) return found;
            }

            return null;
        }
    }
}
