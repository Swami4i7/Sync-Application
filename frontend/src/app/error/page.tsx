'use client'

export const getErrorMessage = (errorCode: string | null) => {
  switch (errorCode) {
    case "OAuthSignin":
      return "There was an error during OAuth sign in.";
      case "OAuthCallback":
        return "There was an error in the OAuth callback.";
        case "OAuthCreateAccount":
          return "There was an error creating your OAuth account.";
          case "EmailCreateAccount":
            return "There was an error creating your email account.";
            case "Callback":
              return "There was an error during the sign in callback.";
              case "OAuthAccountNotLinked":
                return "This email is linked with another provider. Please sign in with that provider.";
                case "EmailSignin":
                  return "Error sending email sign in link. Please try again.";
                  case "CredentialsSignin":
                    return "Please check your credentials and try again.";
                    default:
                      return "An unknown error occurred during authentication.";
                    }
                  };
                  