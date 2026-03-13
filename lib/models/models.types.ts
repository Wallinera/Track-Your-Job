export interface SignUpInputs {
  name: string;
  email: string;
  password: string;
}

export interface SignInInputs {
  email: string;
  password: string;
}

export interface JobApplicationFormInputs {
  company?: string;
  position?: string;
  location?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  tags?: string;
  description?: string;
}
export interface JobApplicationData {
  company?: string;
  position?: string;
  location?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  columnId: string;
  boardId: string;
  tags?: string[];
  description?: string;
}

export interface JobApplication {
  _id: string;
  company: string;
  position: string;
  location?: string;
  status: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  order: number;
  columnId?: string;
  tags?: string[];
  description?: string;
}

export interface Column {
  _id: string;
  name: string;
  order: number;
  jobApplications: JobApplication[];
  config?: ColConfig;
}

export interface NewColumn {
  name: string;
  order: number;
  jobApplications: JobApplication[];
  config: ColConfig;
}

export interface Board {
  _id: string;
  name: string;
  columns: Column[];
}

export interface ColConfig {
  color: string;
  icon: string | React.ReactNode;
  name: string;
}
