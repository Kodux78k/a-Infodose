import SafariServices
import os.log

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    func beginRequest(with context: NSExtensionContext) {
        let item = context.inputItems[0] as! NSExtensionItem
        let message = item.userInfo?[SFExtensionMessageKey]
        os_log(.default, "Mensagem recebida do Safari Extension Popup: %{public}@", String(describing: message))
        
        let response = NSExtensionItem()
        response.userInfo = [ SFExtensionMessageKey: [ "status": "Sucesso", "source": "XcodeSwiftHandler" ] ]
        
        context.completeRequest(returningItems: [response], completionHandler: nil)
    }

}