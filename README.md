# Zero Trust Maturity Model Questionnaire

Based on the set of tables found in the [Zero Trust Maturity Model Version 2.0][zta-maturity] document published by
CISA, this questionnaire aims to help organizations track, improve, and report on their progress toward their desired
level of trust.

[zta-maturity]: https://www.cisa.gov/sites/default/files/2023-04/CISA_Zero_Trust_Maturity_Model_Version_2_508c.pdf

## Features

### 🔄 Local Storage
- **Automatic progress saving**: Your answers are automatically saved to browser local storage as you progress through the assessment
- **Resume anytime**: If you close the browser or navigate away, your progress is restored when you return
- **No data loss**: Never lose your work - the assessment picks up right where you left off

### 🔗 URL-Based Sharing
- **Share results via URL**: After completing the assessment, click "Share Results" to copy a shareable link
- **Compact wire format**: Results are encoded into a hex string using an efficient bit-packing format:
  - Byte 0: Wire format version (currently 1)
  - Byte 1: Model version (currently 2)  
  - Remaining bytes: Answer values packed 4 per byte (2 bits each)
  - Total size: ~17 bytes for all 37 questions
- **Hash-based routing**: Uses React Router's HashRouter for static hosting compatibility
- **Read-only sharing**: Recipients see a detailed breakdown of results without ability to edit

### 📊 Detailed Results View
- **Comprehensive breakdown**: View maturity levels for each pillar and capability
- **Color-coded levels**: Visual indicators for Traditional, Initial, Advanced, and Optimal maturity
- **Full answer details**: See the specific answer selected for each capability

## Technical Implementation

- **Frontend**: React + TypeScript + Vite
- **Routing**: React Router v6 with HashRouter for static hosting
- **State Management**: Local storage for persistence
- **Wire Format**: Custom hex encoding for compact URL representation
- **No Backend Required**: Fully client-side application
