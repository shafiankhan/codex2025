# Troubleshooting Guide - Cardano Career Navigator

## Wallet Connection Issues

### Problem: "No Cardano wallets found"

**Solutions:**
1. **Install a Cardano wallet extension:**
   - [Nami Wallet](https://namiwallet.io) - Most popular
   - [Eternl](https://eternl.io) - Feature-rich
   - [Begin Wallet](https://beginwallet.com) - eSIM-enabled (recommended)
   - [Flint Wallet](https://flint-wallet.com) - Simple and secure

2. **After installation:**
   - Refresh the browser page
   - Make sure the extension is enabled
   - Check that the wallet is unlocked

3. **Browser issues:**
   - Try a different browser (Chrome, Firefox, Edge)
   - Disable other extensions temporarily
   - Try incognito/private mode

### Problem: "Failed to connect to [wallet name]"

**Solutions:**
1. **Check wallet status:**
   - Make sure the wallet extension is unlocked
   - Verify you have some ADA in your wallet
   - Check that you're on the correct network (testnet/mainnet)

2. **Permission issues:**
   - Look for wallet popup asking for permission
   - Check if popup was blocked by browser
   - Try clicking the wallet extension icon directly

3. **Network issues:**
   - Switch to testnet if on mainnet (or vice versa)
   - Check wallet network settings
   - Restart the wallet extension

### Problem: "Connection cancelled by user"

**Solutions:**
1. **Try connecting again:**
   - Click "Connect Wallet" button again
   - Make sure to approve the connection in the wallet popup
   - Don't close the wallet popup before approving

2. **Wallet popup issues:**
   - Check if popup appeared behind other windows
   - Look for notification in browser address bar
   - Try clicking the wallet extension icon

## Demo Wallet

If you can't connect a real wallet, use the **Demo Wallet** for testing:

1. Click "Try Demo Wallet" on the home page
2. This provides a simulated wallet experience
3. All features work except real payments
4. Perfect for testing the interface

## Service Issues

### Problem: "Payment required" error

**Solutions:**
1. **Check wallet balance:**
   - Ensure you have enough ADA for the service
   - Assessment: 0.5 ADA
   - Roadmap: 1.5 ADA  
   - Catalyst: 3.0 ADA

2. **Network issues:**
   - Make sure you're on the correct network
   - Check if wallet is synced

3. **Development mode:**
   - Payment verification is skipped in development
   - Check console for mock payment processing

### Problem: "Service temporarily unavailable"

**Solutions:**
1. **Backend connection:**
   - Make sure the server is running (`npm run serve`)
   - Check console for API errors
   - Try refreshing the page

2. **Network connectivity:**
   - Check your internet connection
   - Try again in a few minutes
   - Look for error messages in browser console

## Browser Compatibility

### Supported Browsers:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Known Issues:
- **Internet Explorer**: Not supported
- **Mobile browsers**: Limited wallet support
- **Brave**: May block wallet extensions by default

## Development Issues

### Problem: Server won't start

**Solutions:**
1. **Check Node.js version:**
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Check port availability:**
   - Default port is 8080
   - Make sure no other service is using it
   - Try a different port: `PORT=3000 npm run serve`

### Problem: Frontend not loading

**Solutions:**
1. **Check file paths:**
   - Make sure all files are in correct locations
   - Check browser console for 404 errors

2. **Clear browser cache:**
   - Hard refresh (Ctrl+F5 or Cmd+Shift+R)
   - Clear browser cache and cookies
   - Try incognito mode

## Getting Help

### Debug Information

When reporting issues, please include:

1. **Browser information:**
   - Browser name and version
   - Operating system
   - Any console error messages

2. **Wallet information:**
   - Wallet name and version
   - Network (testnet/mainnet)
   - Whether wallet is unlocked

3. **Steps to reproduce:**
   - What you were trying to do
   - What happened instead
   - Any error messages

### Console Logs

To check console logs:
1. Press F12 (or right-click → Inspect)
2. Go to "Console" tab
3. Look for red error messages
4. Copy any error messages when reporting issues

### Contact

- **GitHub Issues**: [Create an issue](https://github.com/your-repo/issues)
- **Discord**: Join our community server
- **Email**: support@cardano-career-navigator.com

## Quick Fixes

### Reset Everything
If nothing works, try this complete reset:

1. **Clear browser data:**
   - Clear cache and cookies
   - Disable all extensions except wallet
   - Restart browser

2. **Reset wallet:**
   - Lock and unlock wallet
   - Refresh wallet extension
   - Try different wallet if available

3. **Restart application:**
   ```bash
   # Stop server (Ctrl+C)
   npm run serve  # Start again
   ```

### Use Demo Mode
For immediate testing without wallet issues:

1. Click "Try Demo Wallet" on home page
2. All features work with simulated data
3. Perfect for exploring the interface
4. No real payments required

---

**Still having issues?** Try the demo wallet or contact support with the debug information above.