using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public static class MonoExt
{
    public static void DoMoveTo(this Transform trans, Vector3 to, float duration, Action callback = null)
    {
        Tweener.Instance.MoveTo(trans, to, duration, callback);
    }
    public static void DoRotateTo(this Transform trans, Vector3 to, float duration, Action callback = null)
    {
        Tweener.Instance.RotateTo(trans, to, duration, callback);
    }

    public static void DoFadeTo(this Image image,float from, float to, float duration, Action callback = null) {
        
    }
}

public class Tweener : MonoBehaviour
{
    private static Tweener instance = null;
    
    public static Tweener Instance
    {
        get
        {
            if (instance == null)
                instance = FindObjectOfType<Tweener>();

            if (instance == null)
            {
                GameObject gObj = new GameObject();
                gObj.name = "Tweener";
                instance = gObj.AddComponent<Tweener>();
                DontDestroyOnLoad(gObj);
            }
            return instance;
        }
    }

    private void Awake()
    {
        if (instance == null)
        {
            instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    public void MoveTo(Transform target, Vector3 to, float duration, Action callback = null)
    {
        StartCoroutine(Perform(duration, (t) => {
            target.position = Vector3.Lerp(target.position,
                 to, t / duration);
        },callback));
    }

    public void RotateTo(Transform target, Vector3 to, float duration, Action callback = null)
    {
        StartCoroutine(Perform(duration,(t)=> {
            target.localEulerAngles = Vector3.Lerp(target.localEulerAngles,
                to, t / duration);
        },callback));
    }

    public void Wait(float t, Action callback = null) {
        StartCoroutine(DoWait(t,callback));
    }
    IEnumerator DoWait( float t,Action action)
    {
        yield return new WaitForSeconds(t);
        action();
    }
    IEnumerator Perform(float duration,Action<float> action, Action callback=null) {
        float time = 0f;
        while (time < duration)
        {
            action(time);
            time += Time.deltaTime;
            yield return null;
        }
        yield return null;
        callback?.Invoke();
    }

}
