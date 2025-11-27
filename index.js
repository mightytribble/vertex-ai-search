import { extension_settings, renderExtensionTemplateAsync } from '../../extensions.js';
import { eventSource, event_types, saveSettingsDebounced } from '../../../script.js';

const EXTENSION_NAME = 'vertex-ai-search';

// Default settings
const defaults = {
    datastoreId: '',
};

// Initialize settings
extension_settings[EXTENSION_NAME] = extension_settings[EXTENSION_NAME] || {};
Object.assign(extension_settings[EXTENSION_NAME], {
    ...defaults,
    ...extension_settings[EXTENSION_NAME],
});

// Main logic for payload injection
function onChatCompletionSettingsReady(data) {
    const settings = extension_settings[EXTENSION_NAME];

    // 1. Validate Source: Check if chat_completion_source is 'vertexai'
    if (data.chat_completion_source !== 'vertexai') {
        return;
    }

    // 2. Validate Auth: Check if vertexai_auth_mode is 'full'
    if (data.vertexai_auth_mode !== 'full') {
        return;
    }

    // 3. Validate Config: Ensure the Datastore Resource ID is set
    const datastoreId = settings.datastoreId.trim();
    if (!datastoreId) {
        return;
    }

    // 4. Inject Payload
    // Initialize data.tools array if it does not exist
    if (!Array.isArray(data.tools)) {
        data.tools = [];
    }

    const retrievalTool = {
        type: 'retrieval',
        retrieval: {
            vertexAiSearch: {
                datastore: datastoreId,
            },
        },
    };

    data.tools.push(retrievalTool);
    console.log('[Vertex AI Search] Injected retrieval tool:', retrievalTool);
}

// Function to load the settings UI
async function loadSettings() {
    const settingsHtml = await renderExtensionTemplateAsync(EXTENSION_NAME, 'settings');
    $('#extensions_settings').append(settingsHtml);

    // Bind input to settings
    const datastoreInput = $('#vertex-ai-search-datastore-id');
    datastoreInput.val(extension_settings[EXTENSION_NAME].datastoreId);
    datastoreInput.on('input', () => {
        extension_settings[EXTENSION_NAME].datastoreId = datastoreInput.val();
        saveSettingsDebounced();
    });
}

// Entry point
jQuery(async () => {
    // Load settings panel
    await loadSettings();

    // Register event listener
    eventSource.on(event_types.CHAT_COMPLETION_SETTINGS_READY, onChatCompletionSettingsReady);
});
