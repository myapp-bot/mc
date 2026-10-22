# ProGuard Rules pour Mada Commerce (mg.madacommerce.app)
# Conserver les classes Capacitor
-keep public class * extends com.getcapacitor.BridgeActivity
-keep public class * extends com.getcapacitor.Plugin

-dontwarn com.google.android.gms.**
-keep class com.google.android.gms.** { *; }

# WebView et JavaScript Interface
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keepattributes *Annotation*
-keepattributes EnclosingMethod
-keepattributes Signature
-keepattributes InnerClasses
