import { supabase } from '../lib/supabase';
import { BaseService } from './BaseService';

class BudgetService extends BaseService {
  constructor() {
    super('budgets');
  }

  // Tüm bütçeleri getir
  async getAllBudgets() {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          allocations:budget_allocations(*),
          income_sources:budget_income_sources(*),
          expense_categories:budget_expense_categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Bütçeler getirilirken hata:', error);
      }
      return { data: [], error };
    }
  }

  // Bütçe oluştur
  async createBudget(budgetData) {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert([{
          name: budgetData.name,
          year: budgetData.year,
          total_budget: budgetData.totalBudget,
          category: budgetData.category,
          description: budgetData.description,
          status: budgetData.status,
          notes: budgetData.notes,
        }])
        .select()
        .single();

      if (error) throw error;

      // Bütçe tahsislerini ekle
      if (budgetData.allocations && budgetData.allocations.length > 0) {
        await this.addBudgetAllocations(data.id, budgetData.allocations);
      }

      // Gelir kaynaklarını ekle
      if (budgetData.incomeSources && budgetData.incomeSources.length > 0) {
        await this.addIncomeSources(data.id, budgetData.incomeSources);
      }

      // Gider kategorilerini ekle
      if (budgetData.expenseCategories && budgetData.expenseCategories.length > 0) {
        await this.addExpenseCategories(data.id, budgetData.expenseCategories);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Bütçe oluşturulurken hata:', error);
      return { data: null, error };
    }
  }

  // Bütçe güncelle
  async updateBudget(budgetId, budgetData) {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .update({
          name: budgetData.name,
          year: budgetData.year,
          total_budget: budgetData.totalBudget,
          category: budgetData.category,
          description: budgetData.description,
          status: budgetData.status,
          notes: budgetData.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', budgetId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Bütçe güncellenirken hata:', error);
      return { data: null, error };
    }
  }

  // Bütçe sil
  async deleteBudget(budgetId) {
    try {
      // İlişkili verileri sil
      await supabase.from('budget_allocations').delete().eq('budget_id', budgetId);
      await supabase.from('budget_income_sources').delete().eq('budget_id', budgetId);
      await supabase.from('budget_expense_categories').delete().eq('budget_id', budgetId);

      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Bütçe silinirken hata:', error);
      return { error };
    }
  }

  // Bütçe detayını getir
  async getBudgetById(budgetId) {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          allocations:budget_allocations(*),
          income_sources:budget_income_sources(*),
          expense_categories:budget_expense_categories(*)
        `)
        .eq('id', budgetId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Bütçe detayı getirilirken hata:', error);
      return { data: null, error };
    }
  }

  // Bütçe tahsislerini ekle
  async addBudgetAllocations(budgetId, allocations) {
    try {
      const allocationData = allocations.map(allocation => ({
        budget_id: budgetId,
        category: allocation.category,
        amount: allocation.amount,
        description: allocation.description,
        date: allocation.date,
        status: allocation.status || 'pending',
      }));

      const { error } = await supabase
        .from('budget_allocations')
        .insert(allocationData);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Bütçe tahsisleri eklenirken hata:', error);
      return { error };
    }
  }

  // Gelir kaynaklarını ekle
  async addIncomeSources(budgetId, incomeSources) {
    try {
      const incomeData = incomeSources.map(source => ({
        budget_id: budgetId,
        source_name: source.sourceName,
        expected_amount: source.expectedAmount,
        actual_amount: source.actualAmount || 0,
        frequency: source.frequency,
        notes: source.notes,
      }));

      const { error } = await supabase
        .from('budget_income_sources')
        .insert(incomeData);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Gelir kaynakları eklenirken hata:', error);
      return { error };
    }
  }

  // Gider kategorilerini ekle
  async addExpenseCategories(budgetId, expenseCategories) {
    try {
      const expenseData = expenseCategories.map(category => ({
        budget_id: budgetId,
        category_name: category.categoryName,
        allocated_amount: category.allocatedAmount,
        spent_amount: category.spentAmount || 0,
        notes: category.notes,
      }));

      const { error } = await supabase
        .from('budget_expense_categories')
        .insert(expenseData);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Gider kategorileri eklenirken hata:', error);
      return { error };
    }
  }

  // Bütçe tahsisini güncelle
  async updateAllocation(allocationId, updates) {
    try {
      const { data, error } = await supabase
        .from('budget_allocations')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', allocationId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Bütçe tahsisi güncellenirken hata:', error);
      return { data: null, error };
    }
  }

  // Bütçe genel bakışını getir
  async getBudgetOverview() {
    try {
      const { data: budgets, error } = await supabase
        .from('budgets')
        .select(`
          *,
          allocations:budget_allocations(*)
        `);

      if (error) throw error;

      const overview = {
        totalBudgets: budgets.length,
        totalAmount: budgets.reduce((sum, b) => sum + parseFloat(b.total_budget || 0), 0),
        totalAllocated: budgets.reduce((sum, budget) => {
          const allocated = budget.allocations?.reduce((allocSum, alloc) => 
            allocSum + parseFloat(alloc.amount || 0), 0) || 0;
          return sum + allocated;
        }, 0),
        averageUtilization: budgets.length > 0 
          ? budgets.reduce((sum, budget) => {
              const allocated = budget.allocations?.reduce((allocSum, alloc) => 
                allocSum + parseFloat(alloc.amount || 0), 0) || 0;
              const utilization = (allocated / parseFloat(budget.total_budget || 1)) * 100;
              return sum + utilization;
            }, 0) / budgets.length
          : 0,
        categoryBreakdown: budgets.reduce((acc, budget) => {
          acc[budget.category] = (acc[budget.category] || 0) + parseFloat(budget.total_budget || 0);
          return acc;
        }, {}),
      };

      return { data: overview, error: null };
    } catch (error) {
      console.error('Bütçe genel bakışı getirilirken hata:', error);
      return { data: null, error };
    }
  }

  // Yıla göre bütçeleri getir
  async getBudgetsByYear(year) {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          allocations:budget_allocations(*)
        `)
        .eq('year', year)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Yıl bütçeleri getirilirken hata:', error);
      return { data: [], error };
    }
  }

  // Kategoriye göre bütçeleri getir
  async getBudgetsByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          allocations:budget_allocations(*)
        `)
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Kategori bütçeleri getirilirken hata:', error);
      return { data: [], error };
    }
  }

  // Duruma göre bütçeleri getir
  async getBudgetsByStatus(status) {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          allocations:budget_allocations(*)
        `)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Durum bütçeleri getirilirken hata:', error);
      return { data: [], error };
    }
  }

  // Bütçe arama
  async searchBudgets(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          allocations:budget_allocations(*)
        `)
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Bütçe arama hatası:', error);
      return { data: [], error };
    }
  }

  // Bütçe kullanım oranını hesapla
  async calculateBudgetUtilization(budgetId) {
    try {
      const { data: budget, error } = await supabase
        .from('budgets')
        .select(`
          total_budget,
          allocations:budget_allocations(amount)
        `)
        .eq('id', budgetId)
        .single();

      if (error) throw error;

      const totalAllocated = budget.allocations?.reduce((sum, alloc) => 
        sum + parseFloat(alloc.amount || 0), 0) || 0;
      const utilization = (totalAllocated / parseFloat(budget.total_budget || 1)) * 100;

      return { data: Math.min(utilization, 100), error: null };
    } catch (error) {
      console.error('Bütçe kullanım oranı hesaplanırken hata:', error);
      return { data: 0, error };
    }
  }

  // Bütçe varyansını hesapla
  async calculateBudgetVariance(budgetId) {
    try {
      const { data: budget, error } = await supabase
        .from('budgets')
        .select(`
          total_budget,
          allocations:budget_allocations(amount)
        `)
        .eq('id', budgetId)
        .single();

      if (error) throw error;

      const totalAllocated = budget.allocations?.reduce((sum, alloc) => 
        sum + parseFloat(alloc.amount || 0), 0) || 0;
      const variance = parseFloat(budget.total_budget || 0) - totalAllocated;

      return { data: variance, error: null };
    } catch (error) {
      console.error('Bütçe varyansı hesaplanırken hata:', error);
      return { data: 0, error };
    }
  }

  // Bütçe raporu oluştur
  async generateBudgetReport(budgetId) {
    try {
      const { data: budget, error } = await supabase
        .from('budgets')
        .select(`
          *,
          allocations:budget_allocations(*),
          income_sources:budget_income_sources(*),
          expense_categories:budget_expense_categories(*)
        `)
        .eq('id', budgetId)
        .single();

      if (error) throw error;

      const report = {
        budget: budget,
        utilization: await this.calculateBudgetUtilization(budgetId),
        variance: await this.calculateBudgetVariance(budgetId),
        allocationBreakdown: budget.allocations?.reduce((acc, alloc) => {
          acc[alloc.category] = (acc[alloc.category] || 0) + parseFloat(alloc.amount || 0);
          return acc;
        }, {}),
        totalIncome: budget.income_sources?.reduce((sum, source) => 
          sum + parseFloat(source.actual_amount || 0), 0) || 0,
        totalExpenses: budget.expense_categories?.reduce((sum, category) => 
          sum + parseFloat(category.spent_amount || 0), 0) || 0,
      };

      return { data: report, error: null };
    } catch (error) {
      console.error('Bütçe raporu oluşturulurken hata:', error);
      return { data: null, error };
    }
  }

  // Bütçe istatistiklerini getir
  async getBudgetStats() {
    try {
      const { data: budgets, error } = await supabase
        .from('budgets')
        .select(`
          status,
          total_budget,
          category,
          allocations:budget_allocations(amount)
        `);

      if (error) throw error;

      const stats = {
        total: budgets.length,
        active: budgets.filter(b => b.status === 'active').length,
        completed: budgets.filter(b => b.status === 'completed').length,
        totalBudget: budgets.reduce((sum, b) => sum + parseFloat(b.total_budget || 0), 0),
        totalAllocated: budgets.reduce((sum, budget) => {
          const allocated = budget.allocations?.reduce((allocSum, alloc) => 
            allocSum + parseFloat(alloc.amount || 0), 0) || 0;
          return sum + allocated;
        }, 0),
        categoryBreakdown: budgets.reduce((acc, budget) => {
          acc[budget.category] = (acc[budget.category] || 0) + parseFloat(budget.total_budget || 0);
          return acc;
        }, {}),
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Bütçe istatistikleri getirilirken hata:', error);
      return { data: null, error };
    }
  }
}

export const budgetService = new BudgetService();


