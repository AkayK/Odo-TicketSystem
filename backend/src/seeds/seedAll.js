require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const SALT_ROUNDS = 12;

const departments = [
  { name: 'IT', description: 'Information Technology — systems, infrastructure, and software' },
  { name: 'HR', description: 'Human Resources — recruitment, benefits, and employee relations' },
  { name: 'Finance', description: 'Finance — accounting, budgets, and financial reporting' },
  { name: 'Operations', description: 'Operations — facilities, logistics, and daily operations' },
  { name: 'General', description: 'General — cross-department and miscellaneous requests' },
  { name: 'Marketing', description: 'Marketing — campaigns, branding, and communications' },
  { name: 'Legal', description: 'Legal — contracts, compliance, and regulatory affairs' },
  { name: 'Customer Support', description: 'Customer Support — client issues, feedback, and escalations' },
];

const categories = [
  // IT (8 categories)
  { name: 'Hardware Issue', description: 'Laptop, desktop, printer, and peripheral problems', department: 'IT' },
  { name: 'Software Issue', description: 'Application errors, crashes, and software installation', department: 'IT' },
  { name: 'Network Issue', description: 'Internet, VPN, Wi-Fi, and connectivity problems', department: 'IT' },
  { name: 'Email & Accounts', description: 'Email setup, password resets, and account access', department: 'IT' },
  { name: 'Security Incident', description: 'Suspicious activity, phishing, and data breach reports', department: 'IT' },
  { name: 'New Equipment Request', description: 'Request for new hardware, monitors, or peripherals', department: 'IT' },
  { name: 'Server & Infrastructure', description: 'Server downtime, database issues, and hosting problems', department: 'IT' },
  { name: 'Software License', description: 'License renewals, new software purchases, and upgrades', department: 'IT' },

  // HR (6 categories)
  { name: 'Payroll Inquiry', description: 'Salary, deductions, overtime, and payment questions', department: 'HR' },
  { name: 'Leave Request', description: 'Vacation, sick leave, parental leave, and time-off requests', department: 'HR' },
  { name: 'Onboarding', description: 'New hire setup, orientation, and documentation', department: 'HR' },
  { name: 'Benefits & Insurance', description: 'Health insurance, retirement plans, and benefit enrollment', department: 'HR' },
  { name: 'Training Request', description: 'Professional development, certifications, and workshops', department: 'HR' },
  { name: 'Employee Complaint', description: 'Workplace concerns, conflict resolution, and grievances', department: 'HR' },

  // Finance (5 categories)
  { name: 'Expense Report', description: 'Travel expenses, receipts, and reimbursement submissions', department: 'Finance' },
  { name: 'Budget Request', description: 'Department budget allocation and approval requests', department: 'Finance' },
  { name: 'Invoice Processing', description: 'Vendor invoices, payment processing, and purchase orders', department: 'Finance' },
  { name: 'Tax & Compliance', description: 'Tax filing questions, audits, and compliance inquiries', department: 'Finance' },
  { name: 'Financial Report', description: 'Monthly/quarterly report requests and discrepancies', department: 'Finance' },

  // Operations (5 categories)
  { name: 'Facility Maintenance', description: 'Building repairs, HVAC, plumbing, and electrical issues', department: 'Operations' },
  { name: 'Office Supplies', description: 'Stationery, furniture, and supply replenishment requests', department: 'Operations' },
  { name: 'Room Booking Issue', description: 'Meeting room conflicts, equipment setup, and AV problems', department: 'Operations' },
  { name: 'Parking & Access', description: 'Parking passes, key cards, and building access requests', department: 'Operations' },
  { name: 'Health & Safety', description: 'Safety hazards, fire drills, and compliance concerns', department: 'Operations' },

  // General (3 categories)
  { name: 'General Inquiry', description: 'General questions that do not fit other departments', department: 'General' },
  { name: 'Feedback & Suggestion', description: 'Company improvement ideas and process suggestions', department: 'General' },
  { name: 'Internal Communication', description: 'Announcements, memos, and company-wide requests', department: 'General' },

  // Marketing (4 categories)
  { name: 'Campaign Request', description: 'New marketing campaign setup and creative briefs', department: 'Marketing' },
  { name: 'Brand & Design', description: 'Logo usage, brand guidelines, and design requests', department: 'Marketing' },
  { name: 'Social Media Issue', description: 'Social account problems, post scheduling, and analytics', department: 'Marketing' },
  { name: 'Event Planning', description: 'Company events, trade shows, and sponsorship requests', department: 'Marketing' },

  // Legal (3 categories)
  { name: 'Contract Review', description: 'Vendor contracts, NDAs, and agreement reviews', department: 'Legal' },
  { name: 'Compliance Question', description: 'Regulatory compliance, GDPR, and policy inquiries', department: 'Legal' },
  { name: 'Intellectual Property', description: 'Trademark, patent, and copyright matters', department: 'Legal' },

  // Customer Support (4 categories)
  { name: 'Customer Complaint', description: 'Customer escalations and resolution tracking', department: 'Customer Support' },
  { name: 'Refund Request', description: 'Product returns, refund processing, and credits', department: 'Customer Support' },
  { name: 'Service Outage', description: 'Service disruptions affecting customers', department: 'Customer Support' },
  { name: 'Feature Request', description: 'Customer-requested features and product improvements', department: 'Customer Support' },
];

const users = [
  // Admin (no department)
  { email: 'admin@ticketsys.com', password: 'Admin123!', firstName: 'System', lastName: 'Admin', role: 'admin', department: null },

  // IT Department
  { email: 'it.manager@ticketsys.com', password: 'Manager123!', firstName: 'Ahmet', lastName: 'Yilmaz', role: 'manager', department: 'IT' },
  { email: 'it.worker1@ticketsys.com', password: 'Worker123!', firstName: 'Mehmet', lastName: 'Kaya', role: 'worker', department: 'IT' },
  { email: 'it.worker2@ticketsys.com', password: 'Worker123!', firstName: 'Elif', lastName: 'Demir', role: 'worker', department: 'IT' },
  { email: 'it.worker3@ticketsys.com', password: 'Worker123!', firstName: 'Emre', lastName: 'Gunes', role: 'worker', department: 'IT' },

  // HR Department
  { email: 'hr.manager@ticketsys.com', password: 'Manager123!', firstName: 'Ayse', lastName: 'Celik', role: 'manager', department: 'HR' },
  { email: 'hr.worker1@ticketsys.com', password: 'Worker123!', firstName: 'Fatma', lastName: 'Sahin', role: 'worker', department: 'HR' },
  { email: 'hr.worker2@ticketsys.com', password: 'Worker123!', firstName: 'Gokhan', lastName: 'Yurt', role: 'worker', department: 'HR' },

  // Finance Department
  { email: 'fin.manager@ticketsys.com', password: 'Manager123!', firstName: 'Ali', lastName: 'Ozturk', role: 'manager', department: 'Finance' },
  { email: 'fin.worker1@ticketsys.com', password: 'Worker123!', firstName: 'Zeynep', lastName: 'Arslan', role: 'worker', department: 'Finance' },
  { email: 'fin.worker2@ticketsys.com', password: 'Worker123!', firstName: 'Canan', lastName: 'Bulut', role: 'worker', department: 'Finance' },

  // Operations Department
  { email: 'ops.manager@ticketsys.com', password: 'Manager123!', firstName: 'Mustafa', lastName: 'Yildiz', role: 'manager', department: 'Operations' },
  { email: 'ops.worker1@ticketsys.com', password: 'Worker123!', firstName: 'Hasan', lastName: 'Acar', role: 'worker', department: 'Operations' },
  { email: 'ops.worker2@ticketsys.com', password: 'Worker123!', firstName: 'Tuba', lastName: 'Karaca', role: 'worker', department: 'Operations' },

  // Marketing Department
  { email: 'mkt.manager@ticketsys.com', password: 'Manager123!', firstName: 'Selin', lastName: 'Tas', role: 'manager', department: 'Marketing' },
  { email: 'mkt.worker1@ticketsys.com', password: 'Worker123!', firstName: 'Burak', lastName: 'Koc', role: 'worker', department: 'Marketing' },
  { email: 'mkt.worker2@ticketsys.com', password: 'Worker123!', firstName: 'Irem', lastName: 'Aksoy', role: 'worker', department: 'Marketing' },

  // Legal Department
  { email: 'legal.manager@ticketsys.com', password: 'Manager123!', firstName: 'Kemal', lastName: 'Dogan', role: 'manager', department: 'Legal' },
  { email: 'legal.worker1@ticketsys.com', password: 'Worker123!', firstName: 'Sibel', lastName: 'Aydin', role: 'worker', department: 'Legal' },

  // Customer Support Department
  { email: 'cs.manager@ticketsys.com', password: 'Manager123!', firstName: 'Deniz', lastName: 'Polat', role: 'manager', department: 'Customer Support' },
  { email: 'cs.worker1@ticketsys.com', password: 'Worker123!', firstName: 'Cem', lastName: 'Erdem', role: 'worker', department: 'Customer Support' },
  { email: 'cs.worker2@ticketsys.com', password: 'Worker123!', firstName: 'Pinar', lastName: 'Tuncer', role: 'worker', department: 'Customer Support' },

  // General Department
  { email: 'gen.manager@ticketsys.com', password: 'Manager123!', firstName: 'Okan', lastName: 'Sezer', role: 'manager', department: 'General' },
  { email: 'gen.worker1@ticketsys.com', password: 'Worker123!', firstName: 'Derya', lastName: 'Cetin', role: 'worker', department: 'General' },
];

const tickets = [
  // ==================== IT tickets ====================
  {
    title: 'Laptop screen flickering after update',
    description: 'After the latest Windows update, my laptop screen flickers intermittently every 30 seconds. Dell Latitude 5520, docking station connected. Restarting does not help.',
    category: 'Hardware Issue', priority: 'high',
    creatorEmail: 'hr.worker1@ticketsys.com', assigneeEmail: 'it.worker1@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Cannot connect to VPN from home',
    description: 'GlobalProtect VPN shows "Gateway not responding" since this morning. Tried reinstalling the client and restarting the router.',
    category: 'Network Issue', priority: 'high',
    creatorEmail: 'fin.worker1@ticketsys.com', assigneeEmail: 'it.worker2@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Request new monitor for workstation',
    description: 'I need a second 27-inch monitor for my dual-screen setup. Current single monitor is insufficient for financial reporting work.',
    category: 'New Equipment Request', priority: 'low',
    creatorEmail: 'fin.worker1@ticketsys.com', assigneeEmail: null, status: 'open',
  },
  {
    title: 'Outlook keeps crashing on startup',
    description: 'Microsoft Outlook crashes immediately after launch with error "MAPI was unable to load the information service." Happens since the Office 365 update last Friday.',
    category: 'Software Issue', priority: 'medium',
    creatorEmail: 'mkt.worker1@ticketsys.com', assigneeEmail: 'it.worker1@ticketsys.com', status: 'open',
  },
  {
    title: 'Suspicious phishing email received',
    description: 'Received an email from "support@m1crosoft.com" asking me to verify my credentials. Did not click any links. Multiple colleagues received similar messages.',
    category: 'Security Incident', priority: 'critical',
    creatorEmail: 'ops.worker1@ticketsys.com', assigneeEmail: 'it.worker1@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Adobe Creative Suite license expired',
    description: 'My Adobe CC license expired yesterday. I need Photoshop and Illustrator for the Q2 campaign materials. Renewal was supposed to be automatic.',
    category: 'Software License', priority: 'high',
    creatorEmail: 'mkt.worker1@ticketsys.com', assigneeEmail: 'it.worker2@ticketsys.com', status: 'on_hold',
  },
  {
    title: 'Wi-Fi drops every 10 minutes in Building C',
    description: 'The wireless network in Building C, 2nd floor keeps disconnecting. Affects about 20 people. Started after the weekend router maintenance.',
    category: 'Network Issue', priority: 'high',
    creatorEmail: 'ops.manager@ticketsys.com', assigneeEmail: 'it.worker3@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Setup new developer workstation',
    description: 'New developer joining the team on March 20. Needs: MacBook Pro M3, dual monitors, Git/Docker/VS Code pre-installed, VPN configured.',
    category: 'New Equipment Request', priority: 'medium',
    creatorEmail: 'it.manager@ticketsys.com', assigneeEmail: 'it.worker3@ticketsys.com', status: 'open',
  },
  {
    title: 'Database server running out of disk space',
    description: 'Production MySQL server is at 92% disk usage. Estimated to reach 100% within 2 weeks. Need to archive old logs and expand storage.',
    category: 'Server & Infrastructure', priority: 'critical',
    creatorEmail: 'it.worker1@ticketsys.com', assigneeEmail: 'it.worker3@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Password reset not working for LDAP users',
    description: 'Several employees report the "Forgot Password" link returns an error for Active Directory accounts. Local accounts work fine.',
    category: 'Email & Accounts', priority: 'high',
    creatorEmail: 'hr.manager@ticketsys.com', assigneeEmail: null, status: 'open',
  },
  {
    title: 'Slack integration with Jira broken',
    description: 'The Jira bot in Slack stopped posting ticket updates 3 days ago. Webhook URL looks correct. May be a permissions issue after the Jira Cloud upgrade.',
    category: 'Software Issue', priority: 'medium',
    creatorEmail: 'it.worker2@ticketsys.com', assigneeEmail: 'it.worker1@ticketsys.com', status: 'on_hold',
  },
  {
    title: 'Request Zoom Pro license for team lead',
    description: 'Team lead needs Zoom Pro for meetings over 40 minutes with external clients. Currently on free plan.',
    category: 'Software License', priority: 'low',
    creatorEmail: 'cs.manager@ticketsys.com', assigneeEmail: null, status: 'open',
  },

  // ==================== HR tickets ====================
  {
    title: 'Annual leave balance discrepancy',
    description: 'My leave balance shows 5 days but I should have 12 remaining. I only took 3 days in January and started the year with 15 days.',
    category: 'Leave Request', priority: 'medium',
    creatorEmail: 'it.worker1@ticketsys.com', assigneeEmail: 'hr.worker1@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'New hire onboarding — Seda Korkmaz',
    description: 'Seda Korkmaz starts in Marketing on March 15. Need: laptop, email, badge, parking, desk assignment, orientation schedule.',
    category: 'Onboarding', priority: 'medium',
    creatorEmail: 'mkt.manager@ticketsys.com', assigneeEmail: 'hr.worker1@ticketsys.com', status: 'open',
  },
  {
    title: 'Health insurance card not received',
    description: 'Applied for the supplemental health insurance 3 weeks ago but still have not received my card. The policy should be active since February 1.',
    category: 'Benefits & Insurance', priority: 'medium',
    creatorEmail: 'cs.worker1@ticketsys.com', assigneeEmail: null, status: 'open',
  },
  {
    title: 'Request for Python training course',
    description: 'I would like to attend the 3-day Python for Data Analysis course offered by TechAcademy on April 5-7. Cost: 3,200 TL. Pre-approved by my manager.',
    category: 'Training Request', priority: 'low',
    creatorEmail: 'fin.worker2@ticketsys.com', assigneeEmail: 'hr.worker2@ticketsys.com', status: 'open',
  },
  {
    title: 'Workplace noise complaint — open office',
    description: 'The open office on floor 2 is too noisy for focused work. Multiple engineers have complained. Requesting quiet hours policy or noise-cancelling headset budget.',
    category: 'Employee Complaint', priority: 'medium',
    creatorEmail: 'it.worker3@ticketsys.com', assigneeEmail: 'hr.worker2@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Onboarding checklist update needed',
    description: 'The current onboarding checklist is missing steps for VPN setup and security training. Need to update the template before the next hiring wave.',
    category: 'Onboarding', priority: 'low',
    creatorEmail: 'hr.manager@ticketsys.com', assigneeEmail: 'hr.worker1@ticketsys.com', status: 'open',
  },
  {
    title: 'Paternity leave request — Emre Gunes',
    description: 'Requesting 10 days paternity leave starting March 25. Supporting documents submitted to HR portal.',
    category: 'Leave Request', priority: 'medium',
    creatorEmail: 'it.worker3@ticketsys.com', assigneeEmail: null, status: 'open',
  },
  {
    title: 'March payroll discrepancy — missing overtime',
    description: 'My March paycheck is missing 16 hours of overtime worked on March 1-2 weekend. Timesheet was approved by my manager.',
    category: 'Payroll Inquiry', priority: 'high',
    creatorEmail: 'ops.worker2@ticketsys.com', assigneeEmail: 'hr.worker1@ticketsys.com', status: 'in_progress',
  },

  // ==================== Finance tickets ====================
  {
    title: 'March expense report — Istanbul conference',
    description: 'Submitting expense report for Istanbul Tech Conference (Feb 25-27). Total: 4,850 TL including flights, hotel, meals, and taxi.',
    category: 'Expense Report', priority: 'medium',
    creatorEmail: 'it.manager@ticketsys.com', assigneeEmail: 'fin.worker1@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Q2 IT department budget increase request',
    description: 'Requesting 15% budget increase for Q2 to cover: 10 new laptops, server migration costs, and cybersecurity tool subscriptions.',
    category: 'Budget Request', priority: 'high',
    creatorEmail: 'it.manager@ticketsys.com', assigneeEmail: null, status: 'open',
  },
  {
    title: 'Vendor invoice #V-2024-0312 for office furniture',
    description: 'Invoice from OfficePro for 15 standing desks totaling 22,500 TL. PO #PO-2024-088 attached. Net-30 payment terms.',
    category: 'Invoice Processing', priority: 'medium',
    creatorEmail: 'ops.manager@ticketsys.com', assigneeEmail: 'fin.worker2@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Tax withholding rate question',
    description: 'My tax withholding seems higher than expected after the January raise. Can someone verify the correct bracket and rate for my new salary?',
    category: 'Tax & Compliance', priority: 'low',
    creatorEmail: 'mkt.worker2@ticketsys.com', assigneeEmail: null, status: 'open',
  },
  {
    title: 'Q1 financial report discrepancy in Marketing',
    description: 'The Q1 report shows Marketing spent 45,000 TL on "External Services" but our records show 38,000 TL. Need reconciliation.',
    category: 'Financial Report', priority: 'high',
    creatorEmail: 'mkt.manager@ticketsys.com', assigneeEmail: 'fin.worker1@ticketsys.com', status: 'open',
  },
  {
    title: 'Expense reimbursement delayed — 3 weeks overdue',
    description: 'Submitted expense report on Feb 10 for client dinner (1,200 TL) and it still has not been reimbursed. Reference: EXP-2024-0287.',
    category: 'Expense Report', priority: 'medium',
    creatorEmail: 'cs.worker2@ticketsys.com', assigneeEmail: 'fin.worker2@ticketsys.com', status: 'in_progress',
  },

  // ==================== Operations tickets ====================
  {
    title: 'Air conditioning broken on 3rd floor',
    description: 'The AC unit on the 3rd floor east wing has been blowing warm air since Monday. Temperature measured at 28°C. Affecting approximately 40 employees.',
    category: 'Facility Maintenance', priority: 'high',
    creatorEmail: 'it.worker2@ticketsys.com', assigneeEmail: 'ops.worker1@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Meeting room B projector not working',
    description: 'The projector in Meeting Room B shows "No Signal" regardless of which cable or laptop is used. Client presentation scheduled for Wednesday.',
    category: 'Room Booking Issue', priority: 'high',
    creatorEmail: 'mkt.manager@ticketsys.com', assigneeEmail: 'ops.worker1@ticketsys.com', status: 'open',
  },
  {
    title: 'Parking pass for new employee',
    description: 'Need a parking pass for Seda Korkmaz starting March 15 in Marketing. Preferred spot: underground lot B.',
    category: 'Parking & Access', priority: 'low',
    creatorEmail: 'mkt.manager@ticketsys.com', assigneeEmail: null, status: 'open',
  },
  {
    title: 'Office supply order — Q2 stationery',
    description: 'Quarterly stationery order for all departments: printer paper (50 reams), toner cartridges (20), pens, sticky notes, and folders.',
    category: 'Office Supplies', priority: 'low',
    creatorEmail: 'gen.worker1@ticketsys.com', assigneeEmail: 'ops.worker2@ticketsys.com', status: 'open',
  },
  {
    title: 'Emergency exit sign broken — Building A lobby',
    description: 'The illuminated emergency exit sign above the main lobby south door is not working. This is a fire code violation that needs immediate repair.',
    category: 'Health & Safety', priority: 'critical',
    creatorEmail: 'ops.manager@ticketsys.com', assigneeEmail: 'ops.worker1@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Elevator maintenance overdue',
    description: 'Building B elevator #2 annual inspection was due February 28. Maintenance company has not yet scheduled the visit. Need to follow up.',
    category: 'Facility Maintenance', priority: 'medium',
    creatorEmail: 'ops.worker2@ticketsys.com', assigneeEmail: null, status: 'open',
  },
  {
    title: 'Key card access not working for new floor',
    description: 'My key card does not open the 4th floor door after the team moved from 2nd floor last week. Badge ID: 4521.',
    category: 'Parking & Access', priority: 'medium',
    creatorEmail: 'legal.worker1@ticketsys.com', assigneeEmail: 'ops.worker2@ticketsys.com', status: 'in_progress',
  },

  // ==================== Marketing tickets ====================
  {
    title: 'Spring campaign landing page review',
    description: 'The spring promotion landing page draft is ready for internal review. Need feedback from the team before going live on March 10.',
    category: 'Campaign Request', priority: 'medium',
    creatorEmail: 'mkt.worker1@ticketsys.com', assigneeEmail: null, status: 'open',
  },
  {
    title: 'Social media accounts locked after password rotation',
    description: 'Twitter and LinkedIn company accounts are locked after the mandatory password change. 2FA codes going to the old marketing phone.',
    category: 'Social Media Issue', priority: 'high',
    creatorEmail: 'mkt.worker2@ticketsys.com', assigneeEmail: 'mkt.worker1@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Annual company picnic — venue booking',
    description: 'Need to book venue for the annual company picnic on June 15. Budget: 25,000 TL for 200 people. Looking at Belgrad Forest or Polonez Park.',
    category: 'Event Planning', priority: 'low',
    creatorEmail: 'mkt.manager@ticketsys.com', assigneeEmail: 'mkt.worker2@ticketsys.com', status: 'open',
  },
  {
    title: 'Logo update for new product line',
    description: 'The new product line needs a variant of the company logo with a blue accent instead of green. Needed for packaging by April 1.',
    category: 'Brand & Design', priority: 'medium',
    creatorEmail: 'mkt.manager@ticketsys.com', assigneeEmail: 'mkt.worker1@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Google Ads campaign budget approval',
    description: 'Requesting approval for 15,000 TL monthly Google Ads budget for the Q2 lead generation campaign. Expected ROI: 3.5x based on Q1 results.',
    category: 'Campaign Request', priority: 'high',
    creatorEmail: 'mkt.worker1@ticketsys.com', assigneeEmail: null, status: 'open',
  },

  // ==================== Legal tickets ====================
  {
    title: 'NDA review for CloudTech partnership',
    description: 'CloudTech has sent their standard NDA for the upcoming integration project. Need legal review before signing. Deadline: March 12.',
    category: 'Contract Review', priority: 'high',
    creatorEmail: 'it.manager@ticketsys.com', assigneeEmail: 'legal.worker1@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'GDPR compliance audit preparation',
    description: 'Annual GDPR compliance audit scheduled for April 15. Need to prepare data processing records, consent logs, and breach notification procedures.',
    category: 'Compliance Question', priority: 'high',
    creatorEmail: 'legal.manager@ticketsys.com', assigneeEmail: 'legal.worker1@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Trademark registration for new product name',
    description: 'Need to file trademark registration for "OdoFlow" in Turkey and EU. Product launch planned for Q3. Check for existing similar marks first.',
    category: 'Intellectual Property', priority: 'medium',
    creatorEmail: 'mkt.manager@ticketsys.com', assigneeEmail: null, status: 'open',
  },
  {
    title: 'Vendor agreement renewal — DataSync Inc.',
    description: 'Current agreement with DataSync expires April 30. They propose a 12% price increase. Need to review new terms and negotiate.',
    category: 'Contract Review', priority: 'medium',
    creatorEmail: 'fin.manager@ticketsys.com', assigneeEmail: 'legal.worker1@ticketsys.com', status: 'open',
  },

  // ==================== Customer Support tickets ====================
  {
    title: 'Customer escalation — order #4521 delayed',
    description: 'Premium customer (ABC Corp) reports order #4521 is 5 days overdue. Customer is threatening to cancel their annual contract worth 150,000 TL.',
    category: 'Customer Complaint', priority: 'critical',
    creatorEmail: 'cs.worker1@ticketsys.com', assigneeEmail: 'cs.worker1@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Refund request — duplicate charge on invoice #8832',
    description: 'Customer Bright Solutions was charged twice for the same service on invoice #8832. Amount: 2,400 TL. Bank statement provided as proof.',
    category: 'Refund Request', priority: 'high',
    creatorEmail: 'cs.worker1@ticketsys.com', assigneeEmail: null, status: 'open',
  },
  {
    title: 'API service intermittent 503 errors',
    description: 'Multiple customers reporting intermittent 503 errors on our API since 10am. Affects approximately 30% of requests. CloudWatch shows spike in latency.',
    category: 'Service Outage', priority: 'critical',
    creatorEmail: 'cs.manager@ticketsys.com', assigneeEmail: 'cs.worker2@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Feature request — bulk export for reports',
    description: 'Top 5 enterprise customers have requested the ability to bulk export monthly reports as CSV. Currently they have to download one by one.',
    category: 'Feature Request', priority: 'medium',
    creatorEmail: 'cs.worker2@ticketsys.com', assigneeEmail: null, status: 'open',
  },
  {
    title: 'Customer complaint — wrong product shipped',
    description: 'Customer GreenTech received Model B instead of Model A (order #5102). Need to arrange pickup and reship the correct product. Customer upset.',
    category: 'Customer Complaint', priority: 'high',
    creatorEmail: 'cs.worker2@ticketsys.com', assigneeEmail: 'cs.worker1@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Refund processing for cancelled subscription',
    description: 'Customer SolarWind cancelled their annual subscription 2 months in. Pro-rated refund of 8,333 TL needs to be processed. Cancellation confirmed by account manager.',
    category: 'Refund Request', priority: 'medium',
    creatorEmail: 'cs.worker1@ticketsys.com', assigneeEmail: 'cs.worker2@ticketsys.com', status: 'open',
  },

  // ==================== General tickets ====================
  {
    title: 'Company-wide announcement — office hours change',
    description: 'Starting April 1, office hours change from 9:00-18:00 to 8:30-17:30. Need to draft and distribute the announcement to all departments.',
    category: 'Internal Communication', priority: 'medium',
    creatorEmail: 'gen.manager@ticketsys.com', assigneeEmail: 'gen.worker1@ticketsys.com', status: 'in_progress',
  },
  {
    title: 'Suggestion: add recycling bins to kitchen areas',
    description: 'Currently there are no recycling bins in the kitchen/break areas. Proposing separate bins for plastic, paper, and general waste.',
    category: 'Feedback & Suggestion', priority: 'low',
    creatorEmail: 'hr.worker2@ticketsys.com', assigneeEmail: null, status: 'open',
  },
  {
    title: 'Where to find the employee handbook?',
    description: 'I am a new hire and cannot find the employee handbook on the intranet. The link on the welcome email gives a 404 error.',
    category: 'General Inquiry', priority: 'low',
    creatorEmail: 'mkt.worker2@ticketsys.com', assigneeEmail: 'gen.worker1@ticketsys.com', status: 'open',
  },

  // ==================== Closed tickets ====================
  {
    title: 'Install antivirus on new laptops',
    description: 'Batch install of Crowdstrike Falcon on 15 new Dell laptops for the Q1 hiring wave.',
    category: 'Software Issue', priority: 'medium',
    creatorEmail: 'it.manager@ticketsys.com', assigneeEmail: 'it.worker2@ticketsys.com', status: 'closed',
  },
  {
    title: 'February payroll correction for overtime',
    description: 'Overtime hours for 3 Operations team members were not included in February payroll. Corrected in supplemental run.',
    category: 'Payroll Inquiry', priority: 'high',
    creatorEmail: 'ops.manager@ticketsys.com', assigneeEmail: 'hr.worker1@ticketsys.com', status: 'closed',
  },
  {
    title: 'Fix broken link on company website footer',
    description: 'The "Careers" link in the website footer pointed to a 404 page. Updated to the correct URL.',
    category: 'Brand & Design', priority: 'low',
    creatorEmail: 'mkt.worker1@ticketsys.com', assigneeEmail: 'mkt.worker2@ticketsys.com', status: 'closed',
  },
  {
    title: 'Replace broken chair — desk 3F-12',
    description: 'The office chair at desk 3F-12 has a broken gas cylinder and sinks down. Replaced with new ergonomic model.',
    category: 'Office Supplies', priority: 'low',
    creatorEmail: 'it.worker1@ticketsys.com', assigneeEmail: 'ops.worker1@ticketsys.com', status: 'closed',
  },
  {
    title: 'Customer data export for GDPR request',
    description: 'Customer requested all their personal data under GDPR Article 15. Exported and delivered within the 30-day deadline.',
    category: 'Compliance Question', priority: 'high',
    creatorEmail: 'cs.manager@ticketsys.com', assigneeEmail: 'legal.worker1@ticketsys.com', status: 'closed',
  },
  {
    title: 'Resolve double-booking of Meeting Room A',
    description: 'Two teams had conflicting bookings for Meeting Room A on Feb 20. Calendar sync issue identified and fixed in Exchange.',
    category: 'Room Booking Issue', priority: 'medium',
    creatorEmail: 'fin.manager@ticketsys.com', assigneeEmail: 'ops.worker2@ticketsys.com', status: 'closed',
  },
];

async function seedAll() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Disable FK checks for clean reset
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    await connection.execute('TRUNCATE TABLE ticket_history');
    await connection.execute('TRUNCATE TABLE tickets');
    await connection.execute('TRUNCATE TABLE categories');
    await connection.execute('TRUNCATE TABLE users');
    await connection.execute('TRUNCATE TABLE departments');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Cleared existing data\n');

    // --- Departments ---
    const deptMap = {};
    for (const dept of departments) {
      const [result] = await connection.execute(
        'INSERT INTO departments (name, description) VALUES (?, ?)',
        [dept.name, dept.description]
      );
      deptMap[dept.name] = result.insertId;
    }
    console.log(`Seeded ${departments.length} departments`);

    // --- Categories ---
    const catMap = {};
    for (const cat of categories) {
      const deptId = deptMap[cat.department];
      const [result] = await connection.execute(
        'INSERT INTO categories (name, description, department_id) VALUES (?, ?, ?)',
        [cat.name, cat.description, deptId]
      );
      catMap[cat.name] = result.insertId;
    }
    console.log(`Seeded ${categories.length} categories`);

    // --- Users ---
    const userMap = {};
    for (const u of users) {
      const [roles] = await connection.execute('SELECT id FROM roles WHERE name = ?', [u.role]);
      const deptId = u.department ? deptMap[u.department] : null;
      const hash = await bcrypt.hash(u.password, SALT_ROUNDS);

      const [result] = await connection.execute(
        `INSERT INTO users (email, password_hash, first_name, last_name, role_id, department_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [u.email, hash, u.firstName, u.lastName, roles[0].id, deptId]
      );
      userMap[u.email] = result.insertId;
    }
    console.log(`Seeded ${users.length} users`);

    // --- Tickets & History ---
    const statusPath = {
      open: [],
      in_progress: ['in_progress'],
      on_hold: ['in_progress', 'on_hold'],
      closed: ['in_progress', 'closed'],
    };

    let ticketCount = 0;
    let historyCount = 0;

    for (const t of tickets) {
      const catId = catMap[t.category];
      const creatorId = userMap[t.creatorEmail];
      const assigneeId = t.assigneeEmail ? userMap[t.assigneeEmail] : null;

      // Find department from category
      const [catRows] = await connection.execute('SELECT department_id FROM categories WHERE id = ?', [catId]);
      const deptId = catRows[0].department_id;

      // Insert ticket at final state
      const [result] = await connection.execute(
        `INSERT INTO tickets (title, description, category_id, priority, status, created_by, assigned_to, department_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [t.title, t.description, catId, t.priority, t.status, creatorId, assigneeId, deptId]
      );
      const ticketId = result.insertId;
      ticketCount++;

      // Generate history for status transitions
      const transitions = statusPath[t.status] || [];
      let prevStatus = 'open';
      const changerEmail = t.assigneeEmail || t.creatorEmail;
      const changerId = userMap[changerEmail];

      for (const nextStatus of transitions) {
        await connection.execute(
          `INSERT INTO ticket_history (ticket_id, changed_by, field_changed, old_value, new_value)
           VALUES (?, ?, 'status', ?, ?)`,
          [ticketId, changerId, prevStatus, nextStatus]
        );
        prevStatus = nextStatus;
        historyCount++;
      }

      // Generate history for assignment if assigned
      if (assigneeId) {
        const managerEmail = Object.keys(userMap).find((email) => {
          const u = users.find((usr) => usr.email === email);
          return u && u.role === 'manager' && u.department === t.category && false;
        });
        // Use the IT manager or admin as assigner for simplicity
        const assignerId = userMap['admin@ticketsys.com'];
        await connection.execute(
          `INSERT INTO ticket_history (ticket_id, changed_by, field_changed, old_value, new_value)
           VALUES (?, ?, 'assigned_to', NULL, ?)`,
          [ticketId, assignerId, String(assigneeId)]
        );
        historyCount++;
      }
    }
    console.log(`Seeded ${ticketCount} tickets with ${historyCount} history entries`);

    // --- Summary ---
    console.log('\n========================================');
    console.log('  Seed completed successfully!');
    console.log('========================================\n');
    console.log('Test Credentials:');
    console.log('──────────────────────────────────────────────────────────');
    console.log('Admin:            admin@ticketsys.com          / Admin123!');
    console.log('IT Manager:       it.manager@ticketsys.com     / Manager123!');
    console.log('IT Worker 1:      it.worker1@ticketsys.com     / Worker123!');
    console.log('IT Worker 2:      it.worker2@ticketsys.com     / Worker123!');
    console.log('IT Worker 3:      it.worker3@ticketsys.com     / Worker123!');
    console.log('HR Manager:       hr.manager@ticketsys.com     / Manager123!');
    console.log('HR Worker 1:      hr.worker1@ticketsys.com     / Worker123!');
    console.log('HR Worker 2:      hr.worker2@ticketsys.com     / Worker123!');
    console.log('Finance Manager:  fin.manager@ticketsys.com    / Manager123!');
    console.log('Finance Worker 1: fin.worker1@ticketsys.com    / Worker123!');
    console.log('Finance Worker 2: fin.worker2@ticketsys.com    / Worker123!');
    console.log('Ops Manager:      ops.manager@ticketsys.com    / Manager123!');
    console.log('Ops Worker 1:     ops.worker1@ticketsys.com    / Worker123!');
    console.log('Ops Worker 2:     ops.worker2@ticketsys.com    / Worker123!');
    console.log('Mkt Manager:      mkt.manager@ticketsys.com    / Manager123!');
    console.log('Mkt Worker 1:     mkt.worker1@ticketsys.com    / Worker123!');
    console.log('Mkt Worker 2:     mkt.worker2@ticketsys.com    / Worker123!');
    console.log('Legal Manager:    legal.manager@ticketsys.com  / Manager123!');
    console.log('Legal Worker:     legal.worker1@ticketsys.com  / Worker123!');
    console.log('CS Manager:       cs.manager@ticketsys.com     / Manager123!');
    console.log('CS Worker 1:      cs.worker1@ticketsys.com     / Worker123!');
    console.log('CS Worker 2:      cs.worker2@ticketsys.com     / Worker123!');
    console.log('General Manager:  gen.manager@ticketsys.com    / Manager123!');
    console.log('General Worker:   gen.worker1@ticketsys.com    / Worker123!');
    console.log('──────────────────────────────────────────────────────────');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedAll();
