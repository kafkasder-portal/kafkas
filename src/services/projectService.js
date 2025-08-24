import { supabase } from '../lib/supabase';
import { BaseService } from './BaseService';

class ProjectService extends BaseService {
  constructor() {
    super('projects');
  }

  // Tüm projeleri getir
  async getAllProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          team:project_team(*),
          beneficiaries:project_beneficiaries(*),
          milestones:project_milestones(*),
          tasks:project_tasks(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Projeler getirilirken hata:', error);
      return { data: [], error };
    }
  }

  // Proje oluştur
  async createProject(projectData) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name: projectData.name,
          description: projectData.description,
          start_date: projectData.startDate,
          end_date: projectData.endDate,
          budget: projectData.budget,
          category: projectData.category,
          priority: projectData.priority,
          status: projectData.status,
          location: projectData.location,
          manager: projectData.manager,
          objectives: projectData.objectives,
          risks: projectData.risks,
          notes: projectData.notes,
        }])
        .select()
        .single();

      if (error) throw error;

      // Ekip üyelerini ekle
      if (projectData.team && projectData.team.length > 0) {
        await this.addTeamMembers(data.id, projectData.team);
      }

      // Faydalanıcıları ekle
      if (projectData.beneficiaries && projectData.beneficiaries.length > 0) {
        await this.addBeneficiaries(data.id, projectData.beneficiaries);
      }

      // Kilometre taşlarını ekle
      if (projectData.milestones && projectData.milestones.length > 0) {
        await this.addMilestones(data.id, projectData.milestones);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Proje oluşturulurken hata:', error);
      return { data: null, error };
    }
  }

  // Proje güncelle
  async updateProject(projectId, projectData) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          name: projectData.name,
          description: projectData.description,
          start_date: projectData.startDate,
          end_date: projectData.endDate,
          budget: projectData.budget,
          category: projectData.category,
          priority: projectData.priority,
          status: projectData.status,
          location: projectData.location,
          manager: projectData.manager,
          objectives: projectData.objectives,
          risks: projectData.risks,
          notes: projectData.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Proje güncellenirken hata:', error);
      return { data: null, error };
    }
  }

  // Proje sil
  async deleteProject(projectId) {
    try {
      // İlişkili verileri sil
      await supabase.from('project_team').delete().eq('project_id', projectId);
      await supabase.from('project_beneficiaries').delete().eq('project_id', projectId);
      await supabase.from('project_milestones').delete().eq('project_id', projectId);
      await supabase.from('project_tasks').delete().eq('project_id', projectId);

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Proje silinirken hata:', error);
      return { error };
    }
  }

  // Proje detayını getir
  async getProjectById(projectId) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          team:project_team(*),
          beneficiaries:project_beneficiaries(*),
          milestones:project_milestones(*),
          tasks:project_tasks(*)
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Proje detayı getirilirken hata:', error);
      return { data: null, error };
    }
  }

  // Ekip üyelerini ekle
  async addTeamMembers(projectId, teamMembers) {
    try {
      const teamData = teamMembers.map(member => ({
        project_id: projectId,
        user_id: member.userId,
        role: member.role,
        assigned_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('project_team')
        .insert(teamData);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Ekip üyeleri eklenirken hata:', error);
      return { error };
    }
  }

  // Faydalanıcıları ekle
  async addBeneficiaries(projectId, beneficiaries) {
    try {
      const beneficiaryData = beneficiaries.map(beneficiary => ({
        project_id: projectId,
        beneficiary_id: beneficiary.beneficiaryId,
        assistance_type: beneficiary.assistanceType,
        amount: beneficiary.amount,
        notes: beneficiary.notes,
      }));

      const { error } = await supabase
        .from('project_beneficiaries')
        .insert(beneficiaryData);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Faydalanıcılar eklenirken hata:', error);
      return { error };
    }
  }

  // Kilometre taşlarını ekle
  async addMilestones(projectId, milestones) {
    try {
      const milestoneData = milestones.map(milestone => ({
        project_id: projectId,
        title: milestone.title,
        description: milestone.description,
        due_date: milestone.dueDate,
        completed: milestone.completed || false,
        completed_at: milestone.completed ? new Date().toISOString() : null,
      }));

      const { error } = await supabase
        .from('project_milestones')
        .insert(milestoneData);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Kilometre taşları eklenirken hata:', error);
      return { error };
    }
  }

  // Kilometre taşını güncelle
  async updateMilestone(milestoneId, updates) {
    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .update({
          ...updates,
          completed_at: updates.completed ? new Date().toISOString() : null,
        })
        .eq('id', milestoneId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Kilometre taşı güncellenirken hata:', error);
      return { data: null, error };
    }
  }

  // Proje istatistiklerini getir
  async getProjectStats() {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('status, budget, category');

      if (error) throw error;

      const stats = {
        total: projects.length,
        active: projects.filter(p => p.status === 'active').length,
        completed: projects.filter(p => p.status === 'completed').length,
        totalBudget: projects.reduce((sum, p) => sum + parseFloat(p.budget || 0), 0),
        categoryBreakdown: projects.reduce((acc, project) => {
          acc[project.category] = (acc[project.category] || 0) + 1;
          return acc;
        }, {}),
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Proje istatistikleri getirilirken hata:', error);
      return { data: null, error };
    }
  }

  // Kategoriye göre projeleri getir
  async getProjectsByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Kategori projeleri getirilirken hata:', error);
      return { data: [], error };
    }
  }

  // Duruma göre projeleri getir
  async getProjectsByStatus(status) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Durum projeleri getirilirken hata:', error);
      return { data: [], error };
    }
  }

  // Proje arama
  async searchProjects(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Proje arama hatası:', error);
      return { data: [], error };
    }
  }

  // Proje ilerleme durumunu güncelle
  async updateProjectProgress(projectId, progress) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          progress: progress,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Proje ilerlemesi güncellenirken hata:', error);
      return { data: null, error };
    }
  }

  // Proje bütçe kullanımını güncelle
  async updateBudgetUsage(projectId, usedAmount) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          budget_used: usedAmount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Bütçe kullanımı güncellenirken hata:', error);
      return { data: null, error };
    }
  }
}

export const projectService = new ProjectService();
