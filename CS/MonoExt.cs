using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace MRT
{
    public static class MonoExt
    {
        public static void RunMoveRoutine(this Transform trans, Vector3 to, float duration, Action onCompleted = null)
        {
            MyRoutine.Instance.StartCoroutine(
                MyRoutine.Instance.MoveRoutine(trans, to, duration, onCompleted)
            );
        }

        public static IEnumerator CreateMoveRoutine(this Transform trans, Vector3 to, float duration, Action onCompleted = null)
        {
            return MyRoutine.Instance.MoveRoutine(trans, to, duration, onCompleted);
        }

        public static void RunRotateRoutine(this Transform trans, Vector3 to, float duration, Action onCompleted = null)
        {
            MyRoutine.Instance.StartCoroutine(
                MyRoutine.Instance.RotateRoutine(trans, to, duration, onCompleted)
            );
        }

        public static IEnumerator CreateRotateRoutine(this Transform trans, Vector3 to, float duration, Action onCompleted = null)
        {
            return MyRoutine.Instance.RotateRoutine(trans, to, duration, onCompleted);
        }

        public static void RunFadeCanvasRoutine(this CanvasGroup cg, float from, float to, float duration, Action onCompleted = null)
        {
            MyRoutine.Instance.StartCoroutine(
                MyRoutine.Instance.FadeCanvasRoutine(cg, from, to, duration, onCompleted)
            );
        }

        public static IEnumerator CreateFadeCanvasRoutine(this CanvasGroup cg, float from, float to, float duration, Action onCompleted = null)
        {
            return MyRoutine.Instance.FadeCanvasRoutine(cg, from, to, duration, onCompleted);
        }


        public static void AddRoutine(this Transform trans, IEnumerator enumerator)
        {
            MyRoutine.Instance.AddQueue(enumerator);
        }
        public static void RunRoutines(this Transform trans, Action onCompleted = null)
        {
            MyRoutine.Instance.RunQueue(onCompleted);
        }
        public static void AddRoutine(this CanvasGroup canvasGroup, IEnumerator enumerator)
        {
            MyRoutine.Instance.AddQueue(enumerator);
        }
        public static void RunRoutines(this CanvasGroup canvasGroup, Action onCompleted = null)
        {
            MyRoutine.Instance.RunQueue(onCompleted);
        }
    }

}
