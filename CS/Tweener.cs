using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using static UnityEngine.GraphicsBuffer;

public class MyCoroutine : MonoBehaviour
{

    readonly Queue<IEnumerator> coroutines = new();


    public void AddQueue(IEnumerator coroutine) { 
        coroutines.Enqueue(coroutine); 
    }

    public void RunQueue(Action callback = null) { 
        
        StartCoroutine(QueueCoroutine(callback));
    }
    IEnumerator QueueCoroutine(Action callback = null) {
        while (coroutines.Count > 0)
        {
            yield return coroutines.Dequeue();
        }
        coroutines.Clear();
        callback?.Invoke();
    }
    public IEnumerator WaitCoroutine(float t, Action callback)
    {
        yield return new WaitForSeconds(t);
        callback();
    }

    public IEnumerator FadeCanvasCoroutine(CanvasGroup canvasGroup,float from,float to,float duration, Action callback = null) {

        canvasGroup.alpha = from;
        float timer = 0f;
        while (timer < duration)
        {
            canvasGroup.alpha = Mathf.Lerp(from, to, timer / duration);
            timer += Time.deltaTime;
            yield return null;
        }
        canvasGroup.alpha = to;
        callback?.Invoke();
    }

    public IEnumerator MoveCoroutine(Transform target,Vector3 to, float duration, Action callback = null)
    {
        var from = target.position;
        float timer = 0f;
        while (timer < duration)
        {
            target.position = Vector3.LerpUnclamped(from, to, timer / duration);
            timer += Time.deltaTime;
            yield return null;
        }
        target.position = to;
        callback?.Invoke();

    }

    public IEnumerator RotateCoroutine(Transform target, Vector3 to, float duration, Action callback = null)
    {
        var from = target.localEulerAngles;
        float timer = 0f;
        while (timer < duration)
        {
            target.localEulerAngles = Vector3.LerpUnclamped(from, to, timer / duration);
            timer += Time.deltaTime;
            yield return null;
        }
        target.localEulerAngles = to;
        callback?.Invoke();
      
    }

}

