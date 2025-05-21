function HelpPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Help & Documentation
        </h2>
        <p className="text-muted-foreground mt-2">
          Learn how to use SmartPantry effectively with our comprehensive guide.
        </p>
      </div>

      <div className="space-y-12">
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Getting Started</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Creating an Account</h4>
              <p className="text-muted-foreground">
                To start using SmartPantry, register with your name, email,
                phone number, and create a household. If you're joining an
                existing household, you'll need to be invited by the head of the
                household.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Navigating the Dashboard</h4>
              <p className="text-muted-foreground">
                The dashboard provides an overview of all your containers. From
                here, you can add new containers, update existing ones, and
                monitor their weight levels at a glance.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Managing Containers</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Adding a Container</h4>
              <p className="text-muted-foreground">
                Click the "Add Container" button on the dashboard. Enter the
                container name, specify if it's new or existing, and set the
                current weight, max weight, min weight, and alert weight.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Updating Container Weight</h4>
              <p className="text-muted-foreground">
                To update a container's weight, click on the "Update Weight"
                button on the container card. Enter the new weight and submit.
                This will record the change in the container's history.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Understanding Container Status</h4>
              <p className="text-muted-foreground">
                Each container displays a progress bar indicating its current
                fill level. Green indicates well-stocked, yellow indicates
                moderately stocked, and red indicates low stock that needs
                replenishing.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Container History</h4>
              <p className="text-muted-foreground">
                View the weight history of a container by clicking "View
                History" in the container's menu. This shows a chart of weight
                changes over time, helping you track consumption patterns.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Shopping List</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Automatic Generation</h4>
              <p className="text-muted-foreground">
                SmartPantry automatically generates a shopping list based on
                containers that have fallen below their alert weight thresholds.
                Access this list from the "Shopping List" section in the
                sidebar.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Managing the Shopping List</h4>
              <p className="text-muted-foreground">
                You can print the shopping list or copy it to your clipboard
                using the buttons at the top of the page. Check or uncheck items
                to customize what appears on your list.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Managing Your Household</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Adding Members</h4>
              <p className="text-muted-foreground">
                As the head of a household, you can invite members by going to
                the "Household" page and clicking "Invite Member." Enter the
                email address of the person you want to invite.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Removing Members</h4>
              <p className="text-muted-foreground">
                The head of the household can remove members by going to the
                "Household" page and clicking the remove button next to a
                member's name.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Notifications</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Low Stock Alerts</h4>
              <p className="text-muted-foreground">
                When a container falls below its alert weight, a notification is
                generated. You can view all notifications in the "Notifications"
                section accessible from the sidebar.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Managing Notifications</h4>
              <p className="text-muted-foreground">
                Mark notifications as read individually or use the "Mark All as
                Read" button to clear all notifications at once.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Profile Settings</h4>
              <p className="text-muted-foreground">
                Update your name, email address, phone number, and password in
                the "Settings" section. You can also delete your account from
                this page.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Theme Settings</h4>
              <p className="text-muted-foreground">
                Toggle between light and dark mode using the theme toggle button
                in the top navigation bar.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Troubleshooting</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Can't See My Containers</h4>
              <p className="text-muted-foreground">
                Ensure you're logged in with the correct account and that you
                are part of a household. If you're a household member, verify
                that the head of the household has added you correctly.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Missing Notifications</h4>
              <p className="text-muted-foreground">
                Notifications are generated when a container's weight falls
                below the alert threshold. Check your container settings to
                ensure alert weights are set appropriately.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Contact Support</h4>
              <p className="text-muted-foreground">
                If you encounter any issues not covered here, please contact
                support at support@smartpantry.com or use our feedback form in
                the settings menu.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default HelpPage;
