"use client";

export function WorkflowSection() {
  return (
    <section className="py-24 px-4 border-y border-border">
      <div className="w-[76.75rem] max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-2rem)] mx-auto">
        <div className="p-4 md:p-8 relative w-full max-w-none overflow-hidden">
          {/* Dotted background pattern */}
          <div className="pointer-events-none absolute inset-0 h-full w-full bg-[radial-gradient(var(--border)_1px,transparent_1px)] mask-[radial-gradient(circle_at_center,transparent_10%,black_100%)] [background-size:10px_10px] opacity-20"></div>

          {/* Header */}
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                d="M7.99992 5.16658C8.92039 5.16658 9.66658 4.42039 9.66658 3.49992C9.66658 2.57944 8.92039 1.83325 7.99992 1.83325C7.07944 1.83325 6.33325 2.57944 6.33325 3.49992C6.33325 4.42039 7.07944 5.16658 7.99992 5.16658Z"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.79995 4.69995L4.19995 7.29995"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.99992 10.1666C3.92039 10.1666 4.66658 9.42039 4.66658 8.49992C4.66658 7.57944 3.92039 6.83325 2.99992 6.83325C2.07944 6.83325 1.33325 7.57944 1.33325 8.49992C1.33325 9.42039 2.07944 10.1666 2.99992 10.1666Z"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.66675 8.5H11.3334"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.9999 10.1666C13.9204 10.1666 14.6666 9.42039 14.6666 8.49992C14.6666 7.57944 13.9204 6.83325 12.9999 6.83325C12.0794 6.83325 11.3333 7.57944 11.3333 8.49992C11.3333 9.42039 12.0794 10.1666 12.9999 10.1666Z"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.19995 12.3L11.8 9.69995"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.99992 15.1666C8.92039 15.1666 9.66658 14.4204 9.66658 13.4999C9.66658 12.5794 8.92039 11.8333 7.99992 11.8333C7.07944 11.8333 6.33325 12.5794 6.33325 13.4999C6.33325 14.4204 7.07944 15.1666 7.99992 15.1666Z"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="text-foreground text-lg font-medium font-heading">
              Seamless Integration Workflow
            </h3>
          </div>

          <p className="mt-2 text-base text-muted-foreground mb-12 relative z-10">
            StackPatch seamlessly integrates authentication into your Next.js app with zero configuration.
            Watch how it connects all the pieces together.
          </p>

          {/* Workflow Visualization - Desktop */}
          <div className="relative mx-auto my-12 hidden h-full min-h-80 max-w-[67rem] grid-cols-2 p-4 lg:grid">
            {/* Left Column - Services */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-10">
                {/* Next.js */}
                <div className="relative flex items-center gap-2">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-foreground"
                  >
                    <path
                      d="M13.3333 3.1665H2.66659C1.93021 3.1665 1.33325 3.76346 1.33325 4.49984V12.4998C1.33325 13.2362 1.93021 13.8332 2.66659 13.8332H13.3333C14.0696 13.8332 14.6666 13.2362 14.6666 12.4998V4.49984C14.6666 3.76346 14.0696 3.1665 13.3333 3.1665Z"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 5.8335H4.00583"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.66675 5.8335H6.67258"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.33325 5.8335H9.33909"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-foreground text-sm font-medium">Next.js App</span>
                  {/* Animated connecting line */}
                  <svg
                    width="312"
                    height="33"
                    viewBox="0 0 312 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-2 -right-[336px]"
                  >
                    <line
                      x1="0.5"
                      y1="1"
                      x2="311.5"
                      y2="1"
                      stroke="var(--border)"
                      strokeLinecap="round"
                    />
                    <line
                      x1="311.5"
                      y1="1"
                      x2="311.5"
                      y2="32"
                      stroke="var(--border)"
                      strokeLinecap="round"
                    />
                    <line
                      x1="0.5"
                      y1="1"
                      x2="311.5"
                      y2="1"
                      stroke="url(#line-one-gradient)"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        gradientUnits="userSpaceOnUse"
                        id="line-one-gradient"
                        x1="42.36267%"
                        x2="59.86816%"
                        y1="1"
                        y2="0"
                      >
                        <stop stopColor="var(--border)" />
                        <stop offset="0.33" stopColor="var(--primary)" />
                        <stop offset="0.66" stopColor="var(--primary)" />
                        <stop offset="1" stopColor="var(--border)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* NextAuth */}
                <div className="relative flex items-center gap-2">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-foreground"
                  >
                    <path
                      d="M10.6667 12.5L14.6667 8.5L10.6667 4.5"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.33325 4.5L1.33325 8.5L5.33325 12.5"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-foreground text-sm font-medium">NextAuth.js</span>
                  {/* Animated connecting line */}
                  <svg
                    width="323"
                    height="2"
                    viewBox="0 0 323 2"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-2 -right-[347px]"
                  >
                    <line
                      x1="0.5"
                      y1="1"
                      x2="322.5"
                      y2="1"
                      stroke="var(--border)"
                      strokeLinecap="round"
                    />
                    <line
                      x1="0.5"
                      y1="1"
                      x2="322.5"
                      y2="1"
                      stroke="url(#line-two-gradient)"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        gradientUnits="userSpaceOnUse"
                        id="line-two-gradient"
                        x1="42.36267%"
                        x2="59.86816%"
                        y1="1"
                        y2="0"
                      >
                        <stop stopColor="var(--border)" />
                        <stop offset="0.33" stopColor="var(--primary)" />
                        <stop offset="0.66" stopColor="var(--primary)" />
                        <stop offset="1" stopColor="var(--border)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Auth Providers */}
                <div className="relative flex items-center gap-2">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-foreground"
                  >
                    <path
                      d="M9.22125 11.5453C9.35894 11.6085 9.51405 11.6229 9.66105 11.5862C9.80804 11.5495 9.93814 11.4638 10.0299 11.3433L10.2666 11.0333C10.3908 10.8677 10.5518 10.7333 10.737 10.6407C10.9221 10.5481 11.1263 10.4999 11.3333 10.4999H13.3333C13.6869 10.4999 14.026 10.6404 14.2761 10.8904C14.5261 11.1405 14.6666 11.4796 14.6666 11.8333V13.8333C14.6666 14.1869 14.5261 14.526 14.2761 14.7761C14.026 15.0261 13.6869 15.1666 13.3333 15.1666C10.1507 15.1666 7.09841 13.9023 4.84797 11.6519C2.59753 9.40143 1.33325 6.34918 1.33325 3.16659C1.33325 2.81296 1.47373 2.47382 1.72378 2.22378C1.97382 1.97373 2.31296 1.83325 2.66659 1.83325H4.66659C5.02021 1.83325 5.35935 1.97373 5.60939 2.22378C5.85944 2.47382 5.99992 2.81296 5.99992 3.16659V5.16659C5.99992 5.37358 5.95173 5.57773 5.85915 5.76287C5.76658 5.94801 5.63218 6.10906 5.46658 6.23325L5.15458 6.46725C5.0322 6.5607 4.94593 6.69364 4.91045 6.84349C4.87496 6.99333 4.89244 7.15084 4.95992 7.28925C5.87104 9.13983 7.36953 10.6364 9.22125 11.5453Z"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-foreground text-sm font-medium">Auth Providers</span>
                  {/* Animated connecting line */}
                  <svg
                    width="326"
                    height="32"
                    viewBox="0 0 326 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute -right-[350px] bottom-2"
                  >
                    <line y1="31" x2="325" y2="31" stroke="var(--border)" />
                    <line
                      x1="325.5"
                      y1="31"
                      x2="325.5"
                      y2="1"
                      stroke="var(--border)"
                      strokeLinecap="round"
                    />
                    <line
                      y1="31"
                      x2="325"
                      y2="31"
                      stroke="url(#line-three-gradient)"
                    />
                    <defs>
                      <linearGradient
                        id="line-three-gradient"
                        gradientUnits="userSpaceOnUse"
                        x1="42.36267%"
                        x2="59.86816%"
                        y1="1"
                        y2="0"
                      >
                        <stop stopColor="var(--border)" />
                        <stop offset="0.33" stopColor="var(--primary)" />
                        <stop offset="0.66" stopColor="var(--primary)" />
                        <stop offset="1" stopColor="var(--border)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Column - StackPatch Hub */}
            <div className="relative h-16 w-16 overflow-hidden rounded-md bg-card border border-border p-px shadow-xl mx-auto">
              {/* Spinning gradient rings */}
              <div className="absolute inset-0 scale-[1.4] animate-spin rounded-full bg-conic [background-image:conic-gradient(at_center,transparent,var(--primary)_20%,transparent_30%)] [animation-duration:2s]"></div>
              <div className="absolute inset-0 scale-[1.4] animate-spin rounded-full [background-image:conic-gradient(at_center,transparent,var(--accent)_20%,transparent_30%)] [animation-delay:1s] [animation-duration:2s]"></div>
              <div className="relative z-20 flex h-full w-full items-center justify-center rounded-[5px] bg-card">
                <svg
                  width="20"
                  height="24"
                  viewBox="0 0 20 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary"
                >
                  <path
                    d="M0 4.5C0 3.11929 1.11929 2 2.5 2H7.5C8.88071 2 10 3.11929 10 4.5V9.40959C10.0001 9.4396 10.0002 9.46975 10.0002 9.50001C10.0002 10.8787 11.1162 11.9968 12.4942 12C12.4961 12 12.4981 12 12.5 12H17.5C18.8807 12 20 13.1193 20 14.5V19.5C20 20.8807 18.8807 22 17.5 22H12.5C11.1193 22 10 20.8807 10 19.5V14.5C10 14.4931 10 14.4861 10.0001 14.4792C9.98891 13.1081 8.87394 12 7.50017 12C7.4937 12 7.48725 12 7.48079 12H2.5C1.11929 12 0 10.8807 0 9.5V4.5Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            {/* Connected Badge and Services */}
            <div className="relative flex h-full w-full items-center justify-start">
              {/* Horizontal line */}
              <svg
                width="314"
                height="2"
                viewBox="0 0 314 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="0.5"
                  y1="1"
                  x2="313.5"
                  y2="1"
                  stroke="var(--border)"
                  strokeLinecap="round"
                />
                <line
                  x1="0.5"
                  y1="1"
                  x2="313.5"
                  y2="1"
                  stroke="url(#horizontal-line-gradient)"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="horizontal-line-gradient"
                    gradientUnits="userSpaceOnUse"
                    y1="0"
                    y2="1"
                    x1="49.86816%"
                    x2="59.86816%"
                  >
                    <stop stopColor="var(--border)" />
                    <stop offset="0.5" stopColor="var(--primary)" />
                    <stop offset="1" stopColor="var(--border)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Connected Badge */}
              <div className="relative flex flex-col items-center gap-2">
                <span className="relative z-20 rounded-sm border border-primary bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
                  Connected
                </span>

                {/* Vertical lines and service icons */}
                <div className="absolute inset-x-0 -top-30 flex h-full flex-col items-center">
                  {/* Session Provider */}
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-card shadow-md">
                    <svg
                      width="800px"
                      height="800px"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-6 text-primary"
                    >
                      <path
                        d="M3.25781 3.11684C3.67771 3.45796 3.83523 3.43193 4.62369 3.37933L12.0571 2.93299C12.2147 2.93299 12.0836 2.77571 12.0311 2.74957L10.7965 1.85711C10.56 1.67347 10.2448 1.46315 9.64083 1.51576L2.44308 2.04074C2.18059 2.06677 2.12815 2.19801 2.2327 2.30322L3.25781 3.11684ZM3.7041 4.84917V12.6704C3.7041 13.0907 3.91415 13.248 4.38693 13.222L12.5562 12.7493C13.0292 12.7233 13.0819 12.4341 13.0819 12.0927V4.32397C13.0819 3.98306 12.9508 3.79921 12.6612 3.82545L4.12422 4.32397C3.80918 4.35044 3.7041 4.50803 3.7041 4.84917ZM11.7688 5.26872C11.8212 5.50518 11.7688 5.74142 11.5319 5.76799L11.1383 5.84641V11.6205C10.7965 11.8042 10.4814 11.9092 10.2188 11.9092C9.79835 11.9092 9.69305 11.7779 9.37812 11.3844L6.80345 7.34249V11.2532L7.61816 11.437C7.61816 11.437 7.61816 11.9092 6.96086 11.9092L5.14879 12.0143C5.09615 11.9092 5.14879 11.647 5.33259 11.5944L5.80546 11.4634V6.29276L5.1489 6.24015C5.09625 6.00369 5.22739 5.66278 5.5954 5.63631L7.53935 5.50528L10.2188 9.5998V5.97765L9.53564 5.89924C9.4832 5.61018 9.69305 5.40028 9.95576 5.37425L11.7688 5.26872ZM1.83874 1.33212L9.32557 0.780787C10.245 0.701932 10.4815 0.754753 11.0594 1.17452L13.4492 2.85424C13.8436 3.14309 13.975 3.22173 13.975 3.53661V12.7493C13.975 13.3266 13.7647 13.6681 13.0293 13.7203L4.33492 14.2454C3.78291 14.2717 3.52019 14.193 3.23111 13.8253L1.47116 11.5419C1.1558 11.1216 1.02466 10.8071 1.02466 10.4392V2.25041C1.02466 1.77825 1.23504 1.38441 1.83874 1.33212Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>

                  {/* Vertical line */}
                  <svg
                    width="1"
                    height="81"
                    viewBox="0 0 1 81"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0"
                  >
                    <line
                      y1="-0.5"
                      x2="80"
                      y2="-0.5"
                      transform="matrix(0 -1 -1 0 0 80.5)"
                      stroke="var(--border)"
                    />
                    <line
                      y1="-0.5"
                      x2="80"
                      y2="-0.5"
                      transform="matrix(0 -1 -1 0 0 80.5)"
                      stroke="url(#vertical-line-gradient)"
                    />
                    <defs>
                      <linearGradient
                        id="vertical-line-gradient"
                        gradientUnits="userSpaceOnUse"
                        x1="0"
                        x2="2"
                        y1="39.9707%"
                        y2="49.96338%"
                      >
                        <stop stopColor="var(--border)" />
                        <stop offset="0.5" stopColor="var(--primary)" />
                        <stop offset="1" stopColor="var(--border)" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Toaster Component */}
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-card shadow-md">
                    <svg
                      width="29"
                      height="29"
                      viewBox="0 0 29 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-6 text-primary"
                    >
                      <path
                        d="M0.435287 17.7181C0.373 17.4525 0.689403 17.2853 0.882285 17.4782L11.1053 27.7021C11.2981 27.895 11.1309 28.2114 10.8653 28.1491C5.70614 26.9386 1.6453 22.8773 0.435287 17.7181ZM0.092903 13.6206C0.0879588 13.7 0.117779 13.7774 0.173973 13.8336L14.7497 28.4108C14.8059 28.467 14.8834 28.4969 14.9627 28.4919C15.6261 28.4506 16.277 28.3631 16.9122 28.2327C17.1262 28.1888 17.2006 27.9258 17.0461 27.7713L0.813742 11.5373C0.659228 11.3828 0.396218 11.4571 0.352246 11.6712C0.221759 12.3064 0.134254 12.9573 0.092903 13.6206ZM1.27167 8.80927C1.22505 8.91393 1.24879 9.03623 1.3298 9.11727L19.4662 27.2554C19.5472 27.3365 19.6695 27.3602 19.7742 27.3136C20.2743 27.0909 20.759 26.8397 21.2262 26.5622C21.3808 26.4703 21.4046 26.2579 21.2775 26.1308L2.45467 7.30609C2.32753 7.17893 2.11511 7.20278 2.02326 7.35736C1.74567 7.8245 1.49445 8.30917 1.27167 8.80927ZM3.63721 5.55259C3.53358 5.44896 3.52718 5.28275 3.62482 5.17344C6.19119 2.3006 9.92421 0.492182 14.0795 0.492385C21.819 0.492765 28.0927 6.76711 28.0923 14.5065C28.0921 18.6619 26.2833 22.3947 23.4102 24.9608C23.301 25.0584 23.1347 25.052 23.0311 24.9484L3.63721 5.55259Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Additional services on the right */}
              <div className="absolute -top-4 right-30 flex h-full flex-col items-center">
                {/* Login/Signup UI */}
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-card shadow-md">
                  <svg
                    width="30"
                    height="31"
                    viewBox="0 0 30 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-6 text-primary"
                  >
                    <g clipPath="url(#clip0_550_104)">
                      <path
                        d="M17.0678 30.0015C16.3014 30.9666 14.7475 30.4379 14.729 29.2055L14.459 11.1809H26.5787C28.7739 11.1809 29.9982 13.7164 28.6332 15.4356L17.0678 30.0015Z"
                        fill="url(#paint0_linear_550_104)"
                      />
                      <path
                        d="M12.1392 0.998475C12.9056 0.0332315 14.4596 0.562115 14.478 1.79448L14.5964 19.8191H2.62832C0.433044 19.8191 -0.791301 17.2836 0.573786 15.5643L12.1392 0.998475Z"
                        fill="currentColor"
                      />
                    </g>
                    <defs>
                      <linearGradient
                        id="paint0_linear_550_104"
                        x1="14.459"
                        y1="15.1774"
                        x2="25.2306"
                        y2="19.695"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="var(--primary)" />
                        <stop offset="1" stopColor="var(--accent)" />
                      </linearGradient>
                      <clipPath id="clip0_550_104">
                        <rect width="29.4" height="30" fill="white" transform="translate(0 0.5)" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>

                {/* Vertical line */}
                <svg
                  width="1"
                  height="81"
                  viewBox="0 0 1 81"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <line
                    y1="-0.5"
                    x2="80"
                    y2="-0.5"
                    transform="matrix(0 -1 -1 0 0 80.5)"
                    stroke="var(--border)"
                  />
                  <line
                    y1="-0.5"
                    x2="80"
                    y2="-0.5"
                    transform="matrix(0 -1 -1 0 0 80.5)"
                    stroke="url(#vertical-line-gradient-2)"
                  />
                  <defs>
                    <linearGradient
                      id="vertical-line-gradient-2"
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      x2="2"
                      y1="39.9707%"
                      y2="49.96338%"
                    >
                      <stop stopColor="var(--border)" />
                      <stop offset="0.5" stopColor="var(--primary)" />
                      <stop offset="1" stopColor="var(--border)" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Protected Routes */}
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-card shadow-md">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-6 text-primary"
                  >
                    <mask
                      id="mask0_557_586"
                      style={{ maskType: "luminance" }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="13"
                      height="13"
                    >
                      <path d="M12.6081 0.5H0.5V12.5H12.6081V0.5Z" fill="white" />
                    </mask>
                    <g mask="url(#mask0_557_586)">
                      <path
                        d="M5.14399 4.86798V3.72797C5.14399 3.63196 5.18002 3.55994 5.26398 3.51197L7.55605 2.19199C7.86804 2.012 8.24006 1.92804 8.62401 1.92804C10.064 1.92804 10.976 3.04406 10.976 4.23202C10.976 4.316 10.976 4.41201 10.964 4.50802L8.58799 3.11599C8.44401 3.03201 8.29996 3.03201 8.15598 3.11599L5.14399 4.86798ZM10.496 9.30801V6.58396C10.496 6.41589 10.4239 6.29592 10.28 6.21194L7.26799 4.45995L8.25199 3.89591C8.33597 3.84797 8.408 3.84797 8.49198 3.89591L10.784 5.21591C11.4441 5.59996 11.888 6.41589 11.888 7.20787C11.888 8.11984 11.3481 8.95986 10.496 9.30791V9.30801ZM4.43599 6.90803L3.45199 6.33206C3.36804 6.28409 3.332 6.21207 3.332 6.11605V3.47608C3.332 2.19209 4.316 1.22002 5.64803 1.22002C6.15209 1.22002 6.61999 1.38809 7.01609 1.68805L4.6521 3.05612C4.50814 3.14008 4.43612 3.26007 4.43612 3.42811V6.90813L4.43599 6.90803ZM6.55402 8.13199L5.14399 7.34002V5.66008L6.55402 4.86811L7.96395 5.66008V7.34002L6.55402 8.13199ZM7.46001 11.7801C6.95597 11.7801 6.48807 11.612 6.09197 11.312L8.45594 9.94398C8.59992 9.86002 8.67195 9.74003 8.67195 9.57197V6.09197L9.668 6.66794C9.75196 6.71588 9.788 6.78791 9.788 6.88392V9.5239C9.788 10.8079 8.79194 11.78 7.46001 11.78V11.7801ZM4.61599 9.10406L2.32392 7.78406C1.66387 7.40002 1.21992 6.58408 1.21992 5.79211C1.21992 4.86811 1.77193 4.04012 2.62388 3.69209V6.42807C2.62388 6.59611 2.69593 6.71611 2.83989 6.80006L5.83995 8.54002L4.85595 9.10406C4.77199 9.15201 4.69994 9.15201 4.61599 9.10406ZM4.48406 11.0721C3.12805 11.0721 2.13202 10.052 2.13202 8.79204C2.13202 8.69603 2.14405 8.60002 2.15598 8.50401L4.51997 9.87205C4.66393 9.95604 4.80801 9.95604 4.95196 9.87205L7.96395 8.13212V9.2721C7.96395 9.36814 7.92794 9.44016 7.84396 9.48811L5.55192 10.8081C5.2399 10.9881 4.86788 11.0721 4.48394 11.0721H4.48406ZM7.46001 12.5C8.91204 12.5 10.124 11.468 10.4001 10.1C11.7441 9.75196 12.6081 8.49196 12.6081 7.20799C12.6081 6.36795 12.2481 5.55202 11.6001 4.96399C11.6601 4.71197 11.6961 4.45995 11.6961 4.20806C11.6961 2.49208 10.3041 1.20799 8.69603 1.20799C8.37211 1.20799 8.06009 1.25594 7.74807 1.364C7.20799 0.835977 6.46399 0.5 5.64803 0.5C4.19603 0.5 2.98409 1.53194 2.70799 2.89998C1.364 3.24802 0.5 4.50802 0.5 5.79198C0.5 6.63203 0.859961 7.44796 1.50798 8.03598C1.44798 8.288 1.41197 8.54002 1.41197 8.79192C1.41197 10.5079 2.804 11.792 4.41201 11.792C4.73596 11.792 5.04797 11.744 5.35999 11.636C5.89995 12.164 6.64395 12.5 7.46001 12.5Z"
                        fill="currentColor"
                      />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Bottom horizontal line */}
              <svg
                width="314"
                height="2"
                viewBox="0 0 314 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute bottom-0 left-0"
              >
                <line
                  x1="0.5"
                  y1="1"
                  x2="313.5"
                  y2="1"
                  stroke="var(--border)"
                  strokeLinecap="round"
                />
                <line
                  x1="0.5"
                  y1="1"
                  x2="313.5"
                  y2="1"
                  stroke="url(#horizontal-line-gradient-bottom)"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="horizontal-line-gradient-bottom"
                    gradientUnits="userSpaceOnUse"
                    y1="0"
                    y2="1"
                    x1="49.86816%"
                    x2="59.86816%"
                  >
                    <stop stopColor="var(--border)" />
                    <stop offset="0.5" stopColor="var(--primary)" />
                    <stop offset="1" stopColor="var(--border)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Mobile View - Simplified */}
          <div className="relative mx-auto my-24 h-full w-full scale-[2] sm:scale-[1.5] md:scale-[1.2] lg:hidden">
            <div className="flex flex-col items-center gap-8 p-8">
              <div className="text-center">
                <h4 className="text-foreground font-semibold mb-2">Next.js App</h4>
                <div className="w-px h-8 bg-border mx-auto"></div>
              </div>
              <div className="relative h-16 w-16 overflow-hidden rounded-md bg-card border border-border p-px shadow-xl">
                <div className="absolute inset-0 scale-[1.4] animate-spin rounded-full bg-conic [background-image:conic-gradient(at_center,transparent,var(--primary)_20%,transparent_30%)] [animation-duration:2s]"></div>
                <div className="relative z-20 flex h-full w-full items-center justify-center rounded-[5px] bg-card">
                  <svg
                    width="20"
                    height="24"
                    viewBox="0 0 20 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary"
                  >
                    <path
                      d="M0 4.5C0 3.11929 1.11929 2 2.5 2H7.5C8.88071 2 10 3.11929 10 4.5V9.40959C10.0001 9.4396 10.0002 9.46975 10.0002 9.50001C10.0002 10.8787 11.1162 11.9968 12.4942 12C12.4961 12 12.4981 12 12.5 12H17.5C18.8807 12 20 13.1193 20 14.5V19.5C20 20.8807 18.8807 22 17.5 22H12.5C11.1193 22 10 20.8807 10 19.5V14.5C10 14.4931 10 14.4861 10.0001 14.4792C9.98891 13.1081 8.87394 12 7.50017 12C7.4937 12 7.48725 12 7.48079 12H2.5C1.11929 12 0 10.8807 0 9.5V4.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <div className="w-px h-8 bg-border mx-auto mb-2"></div>
                <h4 className="text-foreground font-semibold">Auth Components</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
