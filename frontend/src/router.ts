import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
} from "vue-router";
import { setTitle } from "@/helpers";
import { getAuth } from "firebase/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      meta: {
        requiresAuth: true,
        requiresVerification: true,
      },
      component: () => import("@/components/App/AppLayout.vue"),
      children: [
        {
          path: "",
          name: "AppCourses",
          meta: {
            title: "Courses",
          },
          component: () =>
            import("@/components/App/Courses/AppCoursesView.vue"),
        },
        {
          path: "course/:courseId",
          meta: {
            title: "Course",
          },
          component: () =>
            import("@/components/App/Course/AppCourseLayout.vue"),
          children: [
            {
              path: "chats",
              component: () =>
                import("@/components/App/Course/Chats/AppCourseChats.vue"),
              children: [
                {
                  path: "",
                  name: "AppCourseChats",
                  component: () =>
                    import(
                      "@/components/App/Course/Chats/AppCourseEmptyChat.vue"
                    ),
                },
                {
                  path: ":chatId",
                  name: "AppCourseChat",
                  component: () =>
                    import(
                      "@/components/App/Course/Chats/Chat/AppCourseChat.vue"
                    ),
                },
              ],
            },
            {
              path: "find",
              name: "AppCourseFindStudents",
              component: () =>
                import(
                  "@/components/App/Course/FindStudents/AppCourseFindStudents.vue"
                ),
            },
            {
              path: "staff",
              name: "AppCourseStaff",
              component: () =>
                import("@/components/App/Course/Staff/AppCourseStaffView.vue"),
            },
            {
              path: "reps",
              name: "AppCourseReps",
              component: () =>
                import("@/components/App/Course/Reps/AppCourseRepsView.vue"),
            },
            {
              path: "students",
              name: "AppCourseStudents",
              component: () =>
                import(
                  "@/components/App/Course/Students/AppCourseStudentsView.vue"
                ),
            },
            {
              path: "projects",
              name: "AppCourseMyProjects",
              component: () =>
                import(
                  "@/components/App/Course/MyProjects/AppCourseProjectsView.vue"
                ),
            },
            {
              path: "editproject/:projectId",
              name: "AppCourseEditProject",
              component: () =>
                import(
                  "@/components/App/Course/EditProject/AppCourseEditProjectView.vue"
                ),
            },
            {
              path: "pendingprojects",
              name: "AppCoursePendingProjects",
              component: () =>
                import(
                  "@/components/App/Course/PendingProjects/AppCoursePendingProjectsView.vue"
                ),
            },
            {
              path: "browseprojects",
              name: "AppCourseBrowseProjects",
              component: () =>
                import(
                  "@/components/App/Course/BrowseProjects/AppCourseBrowseProjectsView.vue"
                ),
            },
            {
              path: "editbid/:projectId",
              name: "AppCourseEditBid",
              component: () =>
                import(
                  "@/components/App/Course/EditBid/AppCourseEditBidView.vue"
                ),
            },
            {
              path: "pendingbids",
              name: "AppCoursePendingBids",
              component: () =>
                import(
                  "@/components/App/Course/PendingBids/AppCoursePendingBidsView.vue"
                ),
            },
          ],
        },
        {
          path: "profile",
          name: "AppProfile",
          meta: {
            title: "My Profile",
          },
          component: () => import("@/components/App/Profile/ProfileView.vue"),
        },
      ],
    },

    // Individual account actions
    {
      path: "/actions",
      component: () => import("@/components/Auth/AuthLayout.vue"),
      redirect: "/",
      children: [
        {
          path: "confirminfo",
          name: "ActionsConfirmInfo",
          meta: {
            requiresAuth: true,
            unverifiedOnly: true,
            title: "Confirm Information",
          },
          component: () =>
            import("@/components/Actions/ActionsConfirmInfoView.vue"),
        },

        // Handle auth email actions
        {
          path: "emailhandler",
          name: "ActionsEmailHandler",
          beforeEnter: (to) => {
            switch (to.query.mode) {
              case "resetPassword":
                // Display reset password UI
                return { name: "ActionsResetPassword", query: to.query };
              case "recoverEmail":
                // Display email recovery UI
                return { name: "ActionsRecoverEmail", query: to.query };
              case "verifyEmail":
                // Display email verification UI
                return { name: "ActionsVerifyEmail", query: to.query };
              default:
                return "/";
            }
          },
          component: () => {},
        },

        {
          path: "resetpassword",
          name: "ActionsResetPassword",
          meta: {
            title: "Reset Password",
          },
          component: () =>
            import("@/components/Actions/ActionsResetPasswordView.vue"),
        },

        {
          path: "recoveremail",
          name: "ActionsRecoverEmail",
          meta: {
            title: "Recover Email",
          },
          component: () =>
            import("@/components/Actions/ActionsRecoverEmailView.vue"),
        },

        {
          path: "verifyemail",
          name: "ActionsVerifyEmail",
          meta: {
            title: "Verify Email",
          },
          component: () =>
            import("@/components/Actions/ActionsVerifyEmailView.vue"),
        },
      ],
    },

    // Authentication pages
    {
      path: "/auth",
      meta: {
        unauthOnly: true,
      },
      component: () => import("@/components/Auth/AuthLayout.vue"),
      children: [
        {
          path: "",
          name: "Auth",
          meta: {
            title: "Welcome",
          },
          component: () =>
            import("@/components/Auth/Select/AuthSelectView.vue"),
        },

        {
          path: "signup",
          name: "AuthSignUp",
          meta: {
            title: "Sign Up",
          },
          component: () => import("@/components/Auth/AuthSignUpView.vue"),
        },

        {
          path: "forgottenpassword",
          name: "AuthForgottenPassword",
          meta: {
            title: "Forgotten your password?",
          },
          component: () =>
            import("@/components/Auth/AuthForgottenPasswordView.vue"),
        },
      ],
    },

    {
      path: "/:catchAll(.*)*",
      component: () => import("@/components/404Error.vue"),
    },
  ],
});

// Route guard to ensure the user is authenticated
router.beforeEach((to) => {
  const title: string = to.matched.find(
    (route) => typeof route.meta.title === "string"
  )?.meta.title as string;
  if (title) setTitle(title);

  return findCorrectedRoute(to);
});

/**
 * Determines if the user is on a disallowed route, and redirect.
 * @param route The route to check, with the current route as default.
 * @returns The corrected route, or undefined if no correction is needed.
 */
export const findCorrectedRoute = (
  route: RouteLocationNormalized = router.currentRoute.value
) => {
  // Get user info
  // const mainStore = useMainStore();
  const user = getAuth().currentUser;
  // if (!user && !mainStore.userLoaded) return; // Function will be called again when the user is loaded

  // User status checks
  const requiresAuth = route.matched.some((route) => route.meta.requiresAuth);
  const unauthOnly = route.matched.some((route) => route.meta.unauthOnly);

  if (requiresAuth && user === null) return { name: "Auth" };
  if (unauthOnly && user !== null) return { name: "AppCourses" };

  // Email verification checks
  const requiresVerification = route.matched.some(
    (route) => route.meta.requiresVerification
  );
  const unverifiedOnly = route.matched.some(
    (route) => route.meta.unverifiedOnly
  );

  if (requiresVerification && user !== null && !user?.emailVerified)
    return { name: "ActionsConfirmInfo" };
  if (unverifiedOnly && user !== null && user?.emailVerified)
    return { name: "AppCourses" };
};

export default router;
