
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Rt : MonoBehaviour
{
    private static Rt _instance = null;
    readonly static Queue<IEnumerator> routines = new();
    static Rt Self
    {
        get
        {
            if (_instance == null) _instance = FindObjectOfType<Rt>();

            if (_instance == null)
            {
                GameObject gObj = new GameObject();
                gObj.name = "Routiner";
                _instance = gObj.AddComponent<Rt>();
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
        Self.StartCoroutine(QueueRoutines(onCompleted));
    }
    public static void WaitFor(float t, Action onCompleted) {
        Self.StartCoroutine(WaitRoutine(t, onCompleted));
    }
    public static void FadeCanvasTo( CanvasGroup cg, float from, float to, float duration, Action onCompleted = null)
    {
        Self.StartCoroutine(FadeCanvasRoutine(cg, from, to, duration, onCompleted));
    }
    public static void MoveTo(Transform target, Vector3 to, float duration, Action onCompleted = null)
    {
        Self.StartCoroutine(MoveRoutine(target,to,duration,onCompleted));
    }
    public static void RotateTo(Transform target, Vector3 to, float duration, Action onCompleted = null)
    {
        Self.StartCoroutine(RotateRoutine(target, to, duration, onCompleted));
    }
    static IEnumerator QueueRoutines(Action onCompleted = null)
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
