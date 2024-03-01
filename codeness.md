public void SendMessageToUnity(String gameObjectName, String methodName, String message) throws Exception
{
        final Class<?> player = Class.forName("com.unity3d.player.UnityPlayer");
        player.getMethod("UnitySendMessage", String.class, String.class,
                String.class).invoke(null, gameObjectName, methodName, message);
}
