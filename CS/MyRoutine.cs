using System;
using System.Collections;
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;
namespace MRT
{
    public class MyRoutine : MonoBehaviour
    {
        readonly Queue<IEnumerator> coroutines = new();
        private static MyRoutine instance = null;

        public static MyRoutine Instance
        {
            get
            {
                if (instance == null) instance = FindObjectOfType<MyRoutine>();

                if (instance == null)
                {
                    GameObject gObj = new GameObject();
                    gObj.name = "Singleton";
                    instance = gObj.AddComponent<MyRoutine>();
                    DontDestroyOnLoad(gObj);
                }
                return instance;
            }
        }

        public void Awake()
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

        public void AddQueue(IEnumerator coroutine)
        {
            coroutines.Enqueue(coroutine);
        }
        public void RunQueue(Action onCompleted = null)
        {
            StartCoroutine(QueueRoutines(onCompleted));
        }
        IEnumerator QueueRoutines(Action onCompleted = null)
        {
            while (coroutines.Count > 0)
            {
                yield return coroutines.Dequeue();
            }
            coroutines.Clear();
            onCompleted?.Invoke();
        }
        public IEnumerator WaitRoutine(float t, Action onCompleted)
        {
            yield return new WaitForSeconds(t);
            onCompleted();
        }

        public IEnumerator FadeCanvasRoutine(CanvasGroup canvasGroup, float from, float to, float duration, Action onCompleted = null)
        {

            canvasGroup.alpha = from;
            float timer = 0f;
            while (timer < duration)
            {
                canvasGroup.alpha = Mathf.Lerp(from, to, timer / duration);
                timer += Time.deltaTime;
                yield return null;
            }
            canvasGroup.alpha = to;
            onCompleted?.Invoke();
        }

        public IEnumerator MoveRoutine(Transform target, Vector3 to, float duration, Action onCompleted = null)
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

        public IEnumerator RotateRoutine(Transform target, Vector3 to, float duration, Action onCompleted = null)
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

}

