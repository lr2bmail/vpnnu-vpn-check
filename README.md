# VPNNu VPN connection check

Compare the public IP observed before and after changing a VPN connection. [Use the live tool on VPNNu.nl](https://vpnnu.nl/tools/vpn-check/).

Open `index.html` in a browser or host these files as a static site. With your VPN off, save the observed IP. Connect your VPN and use **Check again**. If you return to the same tab, the page compares automatically. The IP lookup calls `https://vpnnu.nl/tools/ip.json`; the saved IP lives only in that tab's `sessionStorage` and can be cleared with **Start over**.

An IP change suggests a network route change; it does not prove that a VPN is active. An unchanged IP is also inconclusive. Check the VPN app's connection status. `tool.js` is the same source used by the VPNNu page.

MIT license.
