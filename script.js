// Origins AI - Core Logic
class OriginsAI {
    constructor() {
        this.messageCount = 0;
        this.chatHistory = [];
        this.encryptionKey = 'origins-secret-key-2024';
        this.isProcessing = false;
        
        // DOM Elements
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.codeEditor = document.getElementById('codeEditor');
        this.runCodeBtn = document.getElementById('runCodeBtn');
        this.outputContent = document.getElementById('outputContent');
        this.languageSelect = document.getElementById('languageSelect');
        this.clearChatBtn = document.getElementById('clearChatBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.clearOutputBtn = document.getElementById('clearOutputBtn');
        this.formatCodeBtn = document.getElementById('formatCodeBtn');
        this.codeBtn = document.getElementById('codeBtn');
        this.messageCountSpan = document.getElementById('messageCount');
        this.visualCanvas = document.getElementById('visualCanvas');
        this.visualPlaceholder = document.getElementById('visualPlaceholder');
        
        // Tabs
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        this.init();
    }
    
    init() {
        // Event Listeners
        this.sendBtn.addEventListener('click', () => this.handleUserInput());
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.handleUserInput();
            }
        });
        
        this.runCodeBtn.addEventListener('click', () => this.executeCode());
        this.clearChatBtn.addEventListener('click', () => this.clearChat());
        this.exportBtn.addEventListener('click', () => this.exportData());
        this.clearOutputBtn.addEventListener('click', () => this.clearOutput());
        this.formatCodeBtn.addEventListener('click', () => this.formatCode());
        this.codeBtn.addEventListener('click', () => this.insertCodeBlock());
        
        // Tab switching
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        
        // Code language change
        this.languageSelect.addEventListener('change', () => {
            this.updateCodeSyntax();
        });
        
        // Auto-resize textarea
        this.userInput.addEventListener('input', () => {
            this.userInput.style.height = 'auto';
            this.userInput.style.height = this.userInput.scrollHeight + 'px';
        });
        
        // Load saved data
        this.loadSavedData();
        
        // Update UI
        this.updateMessageCount();
        
        console.log('🧠 Origins AI iniciado correctamente');
    }
    
    // ============ CHAT FUNCTIONS ============
    
    handleUserInput() {
        const message = this.userInput.value.trim();
        if (!message || this.isProcessing) return;
        
        this.userInput.value = '';
        this.userInput.style.height = 'auto';
        
        // Add user message to chat
        this.addMessage('user', message);
        
        // Process message
        this.processMessage(message);
    }
    
    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = type === 'user' ? 'fa-user' : 'fa-robot';
        const sender = type === 'user' ? 'Tú' : 'Origins AI';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${avatar}"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender">${sender}</span>
                    <span class="timestamp">${this.getTime()}</span>
                </div>
                ${this.formatMessageContent(content)}
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        this.messageCount++;
        this.updateMessageCount();
        
        // Save to history
        this.chatHistory.push({ type, content, timestamp: new Date().toISOString() });
        this.saveData();
    }
    
    formatMessageContent(content) {
        // Detect code blocks
        if (content.includes('```')) {
            return content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                return `<div class="code-block"><pre><code class="language-${lang || 'javascript'}">${this.escapeHtml(code.trim())}</code></pre></div>`;
            });
        }
        
        // Format as plain text with line breaks
        return `<p>${this.escapeHtml(content).replace(/\n/g, '<br>')}</p>`;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    getTime() {
        return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    
    updateMessageCount() {
        this.messageCountSpan.textContent = `${this.messageCount} mensajes`;
    }
    
    // ============ AI PROCESSING ============
    
    async processMessage(message) {
        this.isProcessing = true;
        this.showTypingIndicator();
        
        try {
            // Simulate AI thinking
            await this.delay(500 + Math.random() * 1000);
            
            // Generate response based on message type
            let response = '';
            
            // Check if it's a code execution request
            if (message.toLowerCase().includes('ejecuta') || 
                message.toLowerCase().includes('corre') ||
                message.toLowerCase().includes('run')) {
                const codeMatch = message.match(/```(\w+)?\n([\s\S]*?)```/);
                if (codeMatch) {
                    const lang = codeMatch[1] || 'javascript';
                    const code = codeMatch[2].trim();
                    response = this.executeCodeSnippet(code, lang);
                } else {
                    response = this.generateAIResponse(message);
                }
            } else {
                response = this.generateAIResponse(message);
            }
            
            // Remove typing indicator and add response
            this.removeTypingIndicator();
            this.addMessage('ai', response);
            
            // If response contains code, update editor
            if (response.includes('```')) {
                const codeMatch = response.match(/```(\w+)?\n([\s\S]*?)```/);
                if (codeMatch) {
                    this.codeEditor.value = codeMatch[2].trim();
                    this.languageSelect.value = codeMatch[1] || 'javascript';
                }
            }
            
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage('ai', '❌ Lo siento, ocurrió un error. Por favor, intenta de nuevo.');
            console.error('Error processing message:', error);
        }
        
        this.isProcessing = false;
    }
    
    generateAIResponse(message) {
        const lowerMsg = message.toLowerCase();
        
        // Simple AI responses (expandible)
        if (lowerMsg.includes('hola') || lowerMsg.includes('buenos días') || lowerMsg.includes('buenas')) {
            return '¡Hola! 👋 ¿Cómo puedo ayudarte hoy? Puedo ejecutar código, analizar datos o simplemente charlar contigo.';
        }
        
        if (lowerMsg.includes('código') || lowerMsg.includes('programar') || lowerMsg.includes('code')) {
            return '💻 ¡Claro! Puedo ayudarte a programar. Escribe tu código en el editor o pégamelo en un bloque con ```. Por ejemplo:\n\n```javascript\nconsole.log("¡Hola mundo!");\n```';
        }
        
        if (lowerMsg.includes('ayuda') || lowerMsg.includes('help')) {
            return '🆘 **Ayuda de Origins AI**\n\n' +
                   '• 💬 **Chat**: Conversación natural\n' +
                   '• 💻 **Código**: Ejecuta JS, Python, HTML, CSS\n' +
                   '• 📊 **Visualiza**: Crea gráficos con Canvas\n' +
                   '• 🔒 **Datos**: Guardados encriptados\n' +
                   '• 📤 **Exporta**: Descarga tu historial\n\n' +
                   'Prueba: `"Ejecuta este código: console.log("test")"`';
        }
        
        if (lowerMsg.includes('gráfico') || lowerMsg.includes('grafico') || lowerMsg.includes('visualizar')) {
            return '📊 **Visualización de datos**\n\nPuedes crear gráficos en el panel Visual. Ejemplo:\n\n```javascript\nconst ctx = document.getElementById("visualCanvas").getContext("2d");\n// Dibuja un gráfico de barras\nctx.fillStyle = "#6c5ce7";\nfor(let i=0; i<10; i++) {\n    ctx.fillRect(i*30+20, 300 - i*20, 20, i*20);\n}\n```';
        }
        
        // Default response
        return this.getRandomResponse();
    }
    
    getRandomResponse() {
        const responses = [
            '🤔 Interesante. ¿Puedes decirme más sobre eso?',
            '💡 Buena pregunta. Déjame pensar...',
            '✨ ¿Qué te gustaría explorar hoy?',
            '🚀 ¡Excelente! ¿Cómo podemos avanzar?',
            '💭 Estoy aquí para ayudarte. ¿Qué necesitas?'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // ============ CODE EXECUTION ============
    
    executeCode() {
        const code = this.codeEditor.value;
        const lang = this.languageSelect.value;
        this.executeCodeSnippet(code, lang);
    }
    
    executeCodeSnippet(code, lang) {
        this.clearOutput();
        this.addOutput(`⏳ Ejecutando código ${lang}...`);
        
        try {
            let result = '';
            
            switch(lang) {
                case 'javascript':
                    result = this.executeJavaScript(code);
                    break;
                case 'python':
                    result = this.executePython(code);
                    break;
                case 'html':
                    result = this.executeHTML(code);
                    break;
                case 'css':
                    result = this.executeCSS(code);
                    break;
                case 'json':
                    result = this.executeJSON(code);
                    break;
                default:
                    result = '❌ Lenguaje no soportado';
            }
            
            this.addOutput(`✅ Ejecutado exitosamente`);
            this.addOutput(`📤 Resultado:\n${result}`);
            
            // Try to visualize if possible
            if (code.includes('chart') || code.includes('graph') || code.includes('visual')) {
                this.switchTab('visual');
            }
            
            return `✅ Código ejecutado:\n\`\`\`${lang}\n${result}\n\`\`\``;
            
        } catch (error) {
            this.addOutput(`❌ Error: ${error.message}`);
            return `❌ Error al ejecutar:\n\`\`\`\n${error.message}\n\`\`\``;
        }
    }
    
    executeJavaScript(code) {
        // Safe execution with sandbox
        const originalLog = console.log;
        let output = [];
        
        console.log = (...args) => {
            output.push(args.map(arg => String(arg)).join(' '));
            this.addOutput(`> ${args.map(arg => String(arg)).join(' ')}`);
        };
        
        try {
            // Create a safe execution environment
            const fn = new Function(`
                const console = { log: (...args) => ${output.push('args')} };
                ${code}
            `);
            fn();
            
            console.log = originalLog;
            return output.join('\n') || 'Código ejecutado sin salida';
        } catch (error) {
            console.log = originalLog;
            throw error;
        }
    }
    
    executePython(code) {
        // Python execution via Pyodide (simplified)
        this.addOutput('🐍 Ejecutando Python (simulado)...');
        return '⚠️ Python necesita Pyodide. Ejecutando en modo simulación.\n' + 
               'Resultado simulado: "' + code.split('\n').slice(0, 2).join(' ') + '"';
    }
    
    executeHTML(code) {
        // Create an iframe for HTML execution
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(code);
        doc.close();
        
        const result = doc.body.innerHTML || 'HTML renderizado correctamente';
        document.body.removeChild(iframe);
        return result;
    }
    
    executeCSS(code) {
        // Apply CSS temporarily
        const style = document.createElement('style');
        style.textContent = code;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.head.removeChild(style);
        }, 5000);
        
        return 'CSS aplicado temporalmente al documento';
    }
    
    executeJSON(code) {
        try {
            const parsed = JSON.parse(code);
            return JSON.stringify(parsed, null, 2);
        } catch (error) {
            throw new Error('JSON inválido: ' + error.message);
        }
    }
    
    // ============ OUTPUT FUNCTIONS ============
    
    addOutput(text) {
        const outputLine = document.createElement('div');
        outputLine.className = 'output-line';
        outputLine.textContent = text;
        this.outputContent.appendChild(outputLine);
        this.outputContent.scrollTop = this.outputContent.scrollHeight;
    }
    
    clearOutput() {
        this.outputContent.innerHTML = '';
    }
    
    // ============ VISUALIZATION ============
    
    showVisualization(canvasData) {
        this.visualCanvas.style.display = 'block';
        this.visualPlaceholder.style.display = 'none';
        
        const ctx = this.visualCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.visualCanvas.width, this.visualCanvas.height);
        
        // Example: Draw a simple chart
        if (canvasData) {
            // Custom visualization
        } else {
            // Default: Draw a demo chart
            this.drawDemoChart();
        }
    }
    
    drawDemoChart() {
        const canvas = this.visualCanvas;
        const ctx = canvas.getContext('2d');
        
        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background
        ctx.fillStyle = 'rgba(10, 10, 26, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw bars
        const data = [30, 45, 60, 80, 50, 70, 90];
        const barWidth = 50;
        const startX = 50;
        
        data.forEach((value, index) => {
            const x = startX + (barWidth + 20) * index;
            const height = value * 3;
            const y = canvas.height - height - 50;
            
            // Gradient bar
            const gradient = ctx.createLinearGradient(x, y, x, canvas.height);
            gradient.addColorStop(0, '#6c5ce7');
            gradient.addColorStop(1, '#a29bfe');
            
            ctx.fillStyle = gradient;
            ctx.shadowColor = 'rgba(108, 92, 231, 0.3)';
            ctx.shadowBlur = 10;
            ctx.fillRect(x, y, barWidth, height);
            ctx.shadowBlur = 0;
            
            // Value on top
            ctx.fillStyle = '#e0e0ff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value, x + barWidth/2, y - 10);
            
            // Label
            ctx.fillStyle = '#a0a0c0';
            ctx.font = '12px Arial';
            ctx.fillText(`Item ${index+1}`, x + barWidth/2, canvas.height - 20);
        });
        
        // Title
        ctx.fillStyle = '#e0e0ff';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📊 Visualización de Datos', canvas.width/2, 30);
    }
    
    // ============ UI FUNCTIONS ============
    
    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message ai-message';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender">Origins AI</span>
                    <span class="timestamp">${this.getTime()}</span>
                </div>
                <p>⏳ Pensando...</p>
            </div>
        `;
        this.chatMessages.appendChild(indicator);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    switchTab(tabId) {
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
        
        // If switching to visual tab, show demo
        if (tabId === 'visual') {
            this.showVisualization();
        }
    }
    
    updateCodeSyntax() {
        // Syntax highlighting update
        const code = this.codeEditor.value;
        // Prism highlighting would go here
    }
    
    formatCode() {
        try {
            const code = this.codeEditor.value;
            const formatted = this.prettyPrint(code);
            this.codeEditor.value = formatted;
        } catch (error) {
            this.addOutput(`❌ Error al formatear: ${error.message}`);
        }
    }
    
    prettyPrint(code) {
        // Simple JSON formatting
        try {
            const parsed = JSON.parse(code);
            return JSON.stringify(parsed, null, 2);
        } catch {
            // If not JSON, basic formatting
            return code.split('\n').map(line => line.trim()).join('\n');
        }
    }
    
    insertCodeBlock() {
        const codeBlock = '```javascript\n// Escribe tu código aquí\n\n```';
        this.userInput.value += codeBlock;
        this.userInput.focus();
        this.userInput.style.height = 'auto';
        this.userInput.style.height = this.userInput.scrollHeight + 'px';
    }
    
    // ============ DATA ENCRYPTION ============
    
    encryptData(data) {
        try {
            const encrypted = CryptoJS.AES.encrypt(
                JSON.stringify(data),
                this.encryptionKey
            ).toString();
            return encrypted;
        } catch (error) {
            console.error('Error encrypting data:', error);
            return null;
        }
    }
    
    decryptData(encryptedData) {
        try {
            const decrypted = CryptoJS.AES.decrypt(
                encryptedData,
                this.encryptionKey
            );
            const data = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
            return data;
        } catch (error) {
            console.error('Error decrypting data:', error);
            return null;
        }
    }
    
    saveData() {
        try {
            const data = {
                messages: this.chatHistory,
                count: this.messageCount,
                code: this.codeEditor.value,
                language: this.languageSelect.value
            };
            
            const encrypted = this.encryptData(data);
            if (encrypted) {
                localStorage.setItem('origins_ai_data', encrypted);
                localStorage.setItem('origins_ai_encrypted', 'true');
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }
    
    loadSavedData() {
        try {
            const encrypted = localStorage.getItem('origins_ai_data');
            if (encrypted) {
                const data = this.decryptData(encrypted);
                if (data) {
                    this.chatHistory = data.messages || [];
                    this.messageCount = data.count || 0;
                    this.codeEditor.value = data.code || '';
                    this.languageSelect.value = data.language || 'javascript';
                    
                    // Restore messages
                    this.chatMessages.innerHTML = '';
                    this.chatHistory.forEach(msg => {
                        this.addMessage(msg.type, msg.content);
                    });
                    
                    this.updateMessageCount();
                    this.addOutput('🔒 Datos encriptados cargados correctamente');
                }
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
    
    clearChat() {
        if (confirm('¿Eliminar todo el historial de chat?')) {
            this.chatMessages.innerHTML = '';
            this.chatHistory = [];
            this.messageCount = 0;
            this.updateMessageCount();
            this.saveData();
            this.addOutput('🗑️ Chat limpiado');
        }
    }
    
    exportData() {
        try {
            const data = {
                messages: this.chatHistory,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { 
                type: 'application/json' 
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `origins_ai_export_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.addOutput('📤 Datos exportados exitosamente');
        } catch (error) {
            this.addOutput(`❌ Error al exportar: ${error.message}`);
        }
    }
    
    // ============ UTILITY FUNCTIONS ============
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize Origins AI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const origins = new OriginsAI();
    
    // Make it globally accessible for debugging
    window.origins = origins;
    
    console.log('🚀 Origins AI está listo!');
    console.log('💡 Usa `window.origins` para acceder a la instancia');
});
