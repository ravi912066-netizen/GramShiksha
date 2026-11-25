using System;

namespace GramSikha.Core
{
    /// <summary>
    /// Represents the three operational modes supported by Gram Sikha.
    /// </summary>
    public enum ExperienceMode
    {
        MainMenu,
        ThreeDViewer,
        VirtualReality,
        AugmentedReality
    }

    /// <summary>
    /// Supported localization languages for educational content and voiceovers.
    /// </summary>
    public enum LanguageMode
    {
        English,
        Hindi
    }

    /// <summary>
    /// Educational categories for village 3D assets.
    /// </summary>
    public enum ModelCategory
    {
        Housing,            // E.g., Traditional Mud House, Brick Cottage
        Education,          // E.g., Primary School, Open Courtyard Classroom
        Agriculture,        // E.g., Tractor, Wooden Plough, Seed Drill, Crop Field
        WaterResource,      // E.g., Tube Well, Hand Pump, Rainwater Harvesting Tank
        Infrastructure,     // E.g., Panchayat Bhawan, Solar Street Light, Biogas Plant
        FloraAndFauna       // E.g., Neem Tree, Banyan Tree, Dairy Farm
    }
}
