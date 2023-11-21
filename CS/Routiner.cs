
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using static UnityEngine.GraphicsBuffer;

public class Routiner : MonoBehaviour
{
    private static Routiner _instance = null;
    readonly static Queue<IEnumerator> routines = new();
    public static Routiner Rt
    {
        get
        {
            if (_instance == null) _instance = FindObjectOfType<Routiner>();

            if (_instance == null)
            {
                GameObject gObj = new GameObject();
                gObj.name = "Routiner";
                _instance = gObj.AddComponent<Routiner>();
                DontDestroyOnLoad(gObj);
            }
            return _instance;
        }
    }

    public void Awake()
    {
        if (_instance == null)
        {
            _instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    public static void AddRoutine(IEnumerator routine)
    {
        routines.Enqueue(routine);
    }
    public static void RunRoutines(Action onCompleted = null) {
        Rt.StartCoroutine(QueueRoutines(onCompleted));
    }
    public static void WaitFor(float t, Action onCompleted) {
        Rt.StartCoroutine(WaitRoutine(t, onCompleted));
    }
    public static void FadeCanvasTo( CanvasGroup cg, float from, float to, float duration, Action onCompleted = null)
    {
        Rt.StartCoroutine(FadeCanvasRoutine(cg, from, to, duration, onCompleted));
    }
    public static void MoveTo(Transform target, Vector3 to, float duration, Action onCompleted = null)
    {
        Rt.StartCoroutine(MoveRoutine(target,to,duration,onCompleted));
    }
    public static void RotateTo(Transform target, Vector3 to, float duration, Action onCompleted = null)
    {
        Rt.StartCoroutine(RotateRoutine(target, to, duration, onCompleted));
    }
    private static IEnumerator QueueRoutines(Action onCompleted = null)
    {
        if(routines.Count==0) yield break;
        while (routines.Count > 0)
        {
            yield return routines.Dequeue();
        }
        routines.Clear();
        onCompleted?.Invoke();
    }
    public static IEnumerator WaitRoutine(float t, Action onCompleted)
    {
        yield return new WaitForSeconds(t);
        onCompleted();
    }
    public static IEnumerator FadeCanvasRoutine(CanvasGroup canvasGroup, float from, float to, float duration, Action onCompleted = null)
    {

        canvasGroup.alpha = from;
        float timer = 0f;
        while (timer < duration)
        {
            var t = timer / duration;
            canvasGroup.alpha = Mathf.Lerp(from, to, Mathf.SmoothStep(0.0f, 1.0f, t));
            timer += Time.deltaTime;
            yield return null;
        }
        canvasGroup.alpha = to;
        onCompleted?.Invoke();
    }
    public static IEnumerator MoveRoutine(Transform target, Vector3 to, float duration, Action onCompleted = null)
    {
        var from = target.position;
        float timer = 0f;
        while (timer < duration)
        {
            var t = timer / duration;
            target.position = Vector3.Lerp(from, to, Mathf.SmoothStep(0.0f, 1.0f, t));
            timer += Time.deltaTime;
            yield return null;
        }
        target.position = to;
        onCompleted?.Invoke();

    }

    public static IEnumerator RotateRoutine(Transform target, Vector3 to, float duration, Action onCompleted = null)
    {
        var from = target.localEulerAngles;
        float timer = 0f;
        while (timer < duration)
        {
            var t = timer / duration;
            target.localEulerAngles = Vector3.Lerp(from, to, Mathf.SmoothStep(0.0f, 1.0f, t));
            timer += Time.deltaTime;
            yield return null;

        }
        target.localEulerAngles = to;
        onCompleted?.Invoke();

    }

}
