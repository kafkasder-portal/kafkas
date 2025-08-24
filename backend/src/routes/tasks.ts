import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Supabase client
const supabaseUrl =
  process.env.SUPABASE_URL || 'https://fagblbogumttcrsbletc.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZ2JsYm9ndW10dGNyc2JsZXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NDg4OTksImV4cCI6MjA3MTQyNDg5OX0.PNQpiOsctCqIrH20BdylDtzVVKOJW4KmBo79w2izioo';

const supabase = createClient(supabaseUrl, supabaseKey);

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      priority = '',
      assignedTo = '',
    } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let supabaseQuery = supabase.from('tasks').select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${search}%,description.ilike.%${search}%`
      );
    }
    if (status) {
      supabaseQuery = supabaseQuery.eq('status', status);
    }
    if (priority) {
      supabaseQuery = supabaseQuery.eq('priority', priority);
    }
    if (assignedTo) {
      supabaseQuery = supabaseQuery.eq('assigned_to', assignedTo);
    }

    const {
      data: tasks,
      error,
      count,
    } = await supabaseQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const totalTasks = count || 0;

    const formattedTasks =
      tasks?.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        category: task.category,
        assignedTo: task.assigned_to,
        createdBy: task.created_by,
        dueDate: task.due_date,
        startDate: task.start_date,
        completedDate: task.completed_date,
        estimatedHours: task.estimated_hours,
        actualHours: task.actual_hours,
        progress: task.progress,
        tags: task.tags,
        attachments: task.attachments,
        comments: task.comments,
        dependencies: task.dependencies,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      })) || [];

    res.json({
      success: true,
      data: {
        tasks: formattedTasks,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalTasks,
          totalPages: Math.ceil(totalTasks / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.json({
      success: true,
      data: {
        task: {
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          category: task.category,
          assignedTo: task.assigned_to,
          createdBy: task.created_by,
          dueDate: task.due_date,
          startDate: task.start_date,
          completedDate: task.completed_date,
          estimatedHours: task.estimated_hours,
          actualHours: task.actual_hours,
          progress: task.progress,
          tags: task.tags,
          attachments: task.attachments,
          comments: task.comments,
          dependencies: task.dependencies,
          createdAt: task.created_at,
          updatedAt: task.updated_at,
        },
      },
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      category,
      assignedTo,
      dueDate,
      estimatedHours,
      tags,
    } = req.body;

    if (!title || !priority || !status) {
      return res.status(400).json({
        success: false,
        message: 'Title, priority, and status are required',
      });
    }

    const newTask = {
      id: uuidv4(),
      title,
      description: description || '',
      priority,
      status,
      category: category || 'general',
      assigned_to: assignedTo || null,
      created_by: (req as any).user?.id || 'system',
      due_date: dueDate || null,
      start_date: null,
      completed_date: null,
      estimated_hours: estimatedHours || null,
      actual_hours: null,
      progress: 0,
      tags: tags || [],
      attachments: [],
      comments: [],
      dependencies: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('tasks').insert([newTask]);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create task',
      });
    }

    res.status(201).json({
      success: true,
      data: {
        task: {
          id: newTask.id,
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          status: newTask.status,
          category: newTask.category,
          assignedTo: newTask.assigned_to,
          createdBy: newTask.created_by,
          dueDate: newTask.due_date,
          startDate: newTask.start_date,
          completedDate: newTask.completed_date,
          estimatedHours: newTask.estimated_hours,
          actualHours: newTask.actual_hours,
          progress: newTask.progress,
          tags: newTask.tags,
          attachments: newTask.attachments,
          comments: newTask.comments,
          dependencies: newTask.dependencies,
          createdAt: newTask.created_at,
          updatedAt: newTask.updated_at,
        },
      },
      message: 'Task created successfully',
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      priority,
      status,
      category,
      assignedTo,
      dueDate,
      estimatedHours,
      progress,
      tags,
    } = req.body;

    const { data: existingTask, error: checkError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (checkError || !existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const updateData = {
      title: title || existingTask.title,
      description:
        description !== undefined ? description : existingTask.description,
      priority: priority || existingTask.priority,
      status: status || existingTask.status,
      category: category || existingTask.category,
      assigned_to:
        assignedTo !== undefined ? assignedTo : existingTask.assigned_to,
      due_date: dueDate !== undefined ? dueDate : existingTask.due_date,
      estimated_hours:
        estimatedHours !== undefined
          ? estimatedHours
          : existingTask.estimated_hours,
      progress: progress !== undefined ? progress : existingTask.progress,
      tags: tags || existingTask.tags,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error('Database error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to update task',
      });
    }

    res.json({
      success: true,
      data: {
        task: {
          id,
          ...updateData,
        },
      },
      message: 'Task updated successfully',
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Database error:', deleteError);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete task',
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
