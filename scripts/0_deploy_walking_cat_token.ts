// [RU] Ипортируем нужные модули
// [EN] Import the necessary modules
import { web3 } from '@alephium/web3'
import { NodeProvider } from '@alephium/web3'
import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { WalkingCatToken } from '../artifacts/ts'
import { stringToHex } from '@alephium/web3'
import configuration from '../alephium.config'
import { DeployFunction, Deployer, Network } from '@alephium/cli'

// [RU] Создаем функцию для деплоя токенов
// [EN] Create a function for deploying tokens
const deployWalkingCatToken: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
    // [RU] Получаем конфигурации (адрес ноды и приватный ключ) из alephium.config.ts
    // [EN] Retrieve configurations (node address and private key) from alephium.config.ts
    const networkConfig = network

    // [RU] Создаем константы с приватным ключем и адресом ноды
    // [EN] Create constants with the private key and node address
    const privateKey = networkConfig.privateKeys[0]
    const nodeProvider = new NodeProvider(networkConfig.nodeUrl)

    // [RU] Создаем "Подписанта", используя приватный ключ и ноду
    // [EN] Create a "Signer" using the private key and node
    const signer = new PrivateKeyWallet({ privateKey, nodeProvider })

    // [RU] Создаем "Получателя", которому контракт отправит токены после их создания
    // [EN] Create a "Recipient" to whom the contract will send tokens after their creation
    const receiver = '1BCnyrTqTKtikA2c6iYXKrUiet3UmZLpHwnJ6QNbxYjUP'   // [EN] REPLACE THE ADDRESS WITH THE REQUIRED ONE | [RU] ЗАМЕНИТЕ АДРЕС НА НУЖНЫЙ
    
    // [RU] Заполняем поля токена
    const initialFields = {
        symbol: stringToHex('WCAT'),                                    // [EN] CHANGE THE TOKEN SYMBOL                         | [RU] ИЗМЕНИТЕ СИМВОЛ ТОКЕНА
        name: stringToHex('TheWalkingCat'),                             // [EN] CHANGE THE TOKEN NAME                           | [RU] ИЗМЕНИТЕ ИМЯ ТОКЕНА
        decimals: 18n,
        supply: 100000n * (10n ** 18n),                                 // [EN] CHANGE THE QUANTITY (100000n) OF THE TOKEN      | [RU] ИЗМЕНИТЕ КОЛИЧЕСТВО (100000n) ТОКЕНА
    }
    
    // [RU] Развертывание контракта с отправкой токенов
    const deployResult = await WalkingCatToken.deploy(signer, { // [EN] References the compiled WalkingCatToken contract                        | [RU] Обращается к скомпилированному контракту WalkingCatToken
                                                                //      (*.ral -> artifacts.ts/*.ts) and deploys the contract via .deploy       |      (*.ral -> artifacts.ts/*.ts) и разворачивает контракт через .deploy     
        initialFields: initialFields,                           // [EN] Accepts field values from const initialFields                           | [RU] Принимает значения полей из const initialFields
        issueTokenAmount: initialFields.supply,                 // [EN] issueTokenAmount issues tokens and explicitly sets the quantity         | [RU] issueTokenAmount выпускает токены и явно задет количество
        issueTokenTo: receiver                                  // [EN] issueTokenTo sends tokens to the specified address                      | [RU] issueTokenTo отправляет токены на указанный адрес
    })
    
    // [RU] Выводим логи
    console.log('Contract deployed at:', deployResult.contractInstance.address)         // [EN] Logs with the token contract address            | [RU] Логи с адресом контракта токена
    console.log('Token ID:', deployResult.contractInstance.contractId)                  // [EN] Logs with the contract ID                       | [RU] Логи с id контракта
}

export default deployWalkingCatToken