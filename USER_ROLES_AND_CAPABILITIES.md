# User Roles and Capabilities

## Overview

The Call Audit System supports three distinct user roles, each with specific capabilities and priorities:

1. **Executives**
2. **Sales Ops Team**
3. **Sales Team**

---

## 1. Executives

### Primary Focus: Dashboard Analytics

**Key Capabilities (Priority Order):**

1. **Dashboard View** (Highest Priority)
   - View comprehensive analytics dashboard
   - Monitor key performance indicators (KPIs)
   - Track overall system metrics and trends
   - See high-level call audit statistics
   - Review task completion rates
   - Analyze campaign performance

2. **Executive Summary**
   - Total call audits overview
   - Total tasks and completion metrics
   - Active campaigns status
   - Call volume by campaign (with breakdown of Total Calls, Answered Calls, Converted Calls)
   - Call dispositions distribution
   - Task status overview

3. **Data Visualization**
   - Interactive charts and graphs
   - Trend analysis
   - Performance metrics at a glance

**Workflow:**
- Executives primarily interact with the dashboard to get a high-level view of operations
- No direct task management or call audit review required
- Focus on strategic insights and decision-making based on aggregated data

---

## 2. Sales Ops Team

### Primary Focus: Call Audit Review & Task Management

**Key Capabilities (Priority Order):**

1. **Call Audit Review** (Highest Priority)
   - View call audit list page with all call records
   - Access detailed call audit pages for individual calls
   - Review call audio and transcript
   - Analyze call metrics (interest level, duration, disposition)
   - View call summary and AI insights

2. **Task Assignment** (High Priority)
   - Create tasks from actionable items identified in call audits
   - Assign tasks to specific Sales team members
   - Review and verify AI analysis before task creation
   - Set call disposition based on call review

3. **Dashboard Access** (Medium Priority)
   - View dashboard with call data and overall tasks data
   - Monitor call volume by campaign
   - Track call dispositions
   - Review task status overview
   - Analyze campaign performance

4. **Call Audit Management**
   - Filter and search call audits
   - Review call details and summaries
   - Update call dispositions
   - Verify AI-detected interest signals

**Workflow:**
1. **File Upload** (External Dashboard)
   - Call audio files are uploaded via another dashboard/system
   - Files are processed and analyzed by AI

2. **Call Audit Creation**
   - System automatically creates call audit records
   - AI analyzes calls and generates insights
   - Actionable items are identified

3. **Review & Verification** (Sales Ops)
   - Sales Ops reviews call audits in the list view
   - Opens individual call audit detail pages
   - Reviews audio, summary, and AI insights
   - Verifies AI analysis accuracy

4. **Task Creation & Assignment**
   - Sales Ops selects actionable items from call audits
   - Creates tasks from verified actionables
   - Assigns tasks to appropriate Sales team members
   - Sets appropriate call disposition

5. **Monitoring**
   - Uses dashboard to monitor overall performance
   - Tracks task completion rates
   - Reviews call data trends

**Key Pages:**
- Dashboard (with call and task metrics)
- Call Audits List Page (filterable, searchable)
- Call Audit Detail Page (with audio player, summary, charts, disposition selector, actionable items)

---

## 3. Sales Team

### Primary Focus: Task Management & Pipeline View

**Key Capabilities (Priority Order):**

1. **Task Dashboard** (Highest Priority)
   - View all assigned tasks
   - See pending tasks
   - Track task status (Pending, In Progress, Completed)
   - Monitor task priorities

2. **Pipeline View** (High Priority)
   - Visual pipeline representation of tasks
   - See tasks organized by stage/status
   - Track progress through sales pipeline
   - Filter and manage tasks by pipeline stage

3. **Task Detail View** (High Priority)
   - Access detailed information for each task
   - View task description and related actionable
   - See assigned employee information
   - Update task status
   - Add comments and activity notes
   - View task history and timestamps

4. **Task Management**
   - Update task status (Pending → In Progress → Completed)
   - Add comments and notes
   - View related call audit information
   - Access related lead/contact details

**Workflow:**
1. **Task Assignment** (From Sales Ops)
   - Sales Ops creates and assigns tasks from call audits
   - Tasks appear in Sales team member's dashboard

2. **Task Review** (Sales Team)
   - Sales team member views assigned tasks in dashboard
   - Reviews task details and related information
   - Accesses pipeline view to see task flow

3. **Task Execution**
   - Updates task status as work progresses
   - Adds comments and activity notes
   - Completes tasks when finished

4. **Pipeline Management**
   - Views tasks in pipeline format
   - Moves tasks through pipeline stages
   - Tracks progress visually

**Key Pages:**
- Tasks Dashboard (assigned and pending tasks)
- Pipeline View (visual task pipeline)
- Task Detail Page (comprehensive task information)

---

## System Flow Summary

### Complete Workflow:

1. **File Upload** (External System)
   - Call audio files uploaded
   - Files processed by AI

2. **Call Audit Creation** (Automated)
   - System creates call audit records
   - AI generates insights and identifies actionables

3. **Sales Ops Review** (Sales Ops Team)
   - Reviews call audits
   - Verifies AI analysis
   - Sets call disposition
   - Creates and assigns tasks to Sales team

4. **Task Execution** (Sales Team)
   - Receives assigned tasks
   - Views tasks in dashboard and pipeline
   - Updates task status
   - Completes tasks

5. **Monitoring** (All Roles)
   - Executives: High-level dashboard analytics
   - Sales Ops: Call data and task metrics
   - Sales Team: Personal task dashboard

---

## Priority Matrix

### Executives
- **Primary:** Dashboard analytics and KPIs
- **Secondary:** High-level performance metrics
- **Not Required:** Task management, call review

### Sales Ops Team
- **Primary:** Call audit review and task assignment
- **Secondary:** Dashboard monitoring, call audit management
- **Not Required:** Task execution

### Sales Team
- **Primary:** Task management and pipeline view
- **Secondary:** Task detail review and status updates
- **Not Required:** Call audit review, task assignment

---

## Technical Implementation Notes

- Dashboard uses screenshots for visual reference
- Pipeline View uses second screenshot for design reference
- All roles have role-based access control
- Tasks are created from actionable items in call audits
- Call audits contain audio, transcript, summary, and AI insights
- Disposition choices come from backend API
- Real-time updates for task status changes

