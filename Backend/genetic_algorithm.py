# import pandas as pd 
# print("Imported pandas")
# from collections import defaultdict
# print("Imported defaultdict")
# import numpy as np
# print("Imported numpy")
# from supabase import create_client, Client
# print("Imported supabase")
# import os
# print("Imported os")
# from dotenv import load_dotenv
# print("Imported dotenv")

# from deap import base, creator, tools, algorithms
# print("Imported deap")

# print("About to define function...")

# def run_timetable_generation():
#     print("Function is being defined!")
#     """
#     Main function to connect to data, run the genetic algorithm,
#     format the result, and upload it to Supabase.
#     """
#     import random
#     import pandas as pd
#     from collections import defaultdict
#     import numpy as np
#     from supabase import create_client, Client
#     import os
#     from dotenv import load_dotenv
#     from deap import base, creator, tools, algorithms
 
#     load_dotenv()
#     SUPABASE_URL = os.getenv("SUPABASE_URL")
#     SUPABASE_KEY = os.getenv("SUPABASE_KEY")

#     try:
#         supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
#         print("Successfully connected to Supabase!")
        
#         print("Fetching data...")
#         programs_df = pd.DataFrame(supabase.table('programs').select('*').execute().data)
#         courses_df = pd.DataFrame(supabase.table('courses').select('*').execute().data)
#         faculty_df = pd.DataFrame(supabase.table('faculty').select('*').execute().data)
#         rooms_df = pd.DataFrame(supabase.table('rooms').select('*').execute().data)
#         students_df = pd.DataFrame(supabase.table('students').select('*').execute().data)
#         enrollments_df = pd.DataFrame(supabase.table('student_enrollments').select('*').execute().data)
#         print("All data successfully fetched.")
#     except Exception as e:
#         print(f"An error occurred while fetching from Supabase: {e}")
#         return "FAILURE: Data fetching error."


#     courses_df.set_index('course_id', inplace=True)
#     faculty_df.set_index('faculty_id', inplace=True)
#     rooms_df.set_index('room_id', inplace=True)

#     TIME_SLOTS = ["Mon_09-10", "Mon_10-11", "Mon_11-12", "Mon_12-01", "Mon_02-03", "Mon_03-04", "Tue_09-10", "Tue_10-11", "Tue_11-12", "Tue_12-01", "Tue_02-03", "Tue_03-04", "Wed_09-10", "Wed_10-11", "Wed_11-12", "Wed_12-01", "Wed_02-03", "Wed_03-04", "Thu_09-10", "Thu_10-11", "Thu_11-12", "Thu_12-01", "Thu_02-03", "Thu_03-04", "Fri_09-10", "Fri_10-11", "Fri_11-12", "Fri_12-01", "Fri_02-03", "Fri_03-04"]
#     COURSE_IDS = courses_df.index.tolist()
#     ROOM_IDS = rooms_df.index.tolist()

#     students_df['student_group'] = students_df['program_id'] + '_Sem' + students_df['current_semester'].astype(str)
#     student_to_group = dict(zip(students_df['student_id'], students_df['student_group']))
#     course_student_groups = defaultdict(set)
#     for _, row in enrollments_df.iterrows():
#         student_id, course_id = row['student_id'], row['course_id']
#         if student_id in student_to_group:
#             course_student_groups[course_id].add(student_to_group[student_id])

#     course_to_valid_faculty = {}
#     for cid in COURSE_IDS:
#         course_code = courses_df.loc[cid]['course_code']
#         valid_faculty = faculty_df[faculty_df['expertise'].str.contains(course_code, na=False)].index.tolist()
#         course_to_valid_faculty[cid] = valid_faculty if valid_faculty else faculty_df.index.tolist()


#     creator.create("FitnessMax", base.Fitness, weights=(1.0,))
#     creator.create("Individual", list, fitness=creator.FitnessMax)
#     toolbox = base.Toolbox()

#     def create_gene_for_course(course_id):
#         return (course_id, random.choice(TIME_SLOTS), random.choice(ROOM_IDS), random.choice(course_to_valid_faculty[course_id]))
    
#     def create_full_individual():
#         return [create_gene_for_course(cid) for cid in COURSE_IDS]

#     toolbox.register("individual", tools.initIterate, creator.Individual, create_full_individual)
#     toolbox.register("population", tools.initRepeat, list, toolbox.individual)

#     def evaluate_timetable(individual):
#         clashes, penalties = 0, 0
#         time_slot_usage = defaultdict(list)
#         for course_id, time_slot, room_id, faculty_id in individual:
#             student_groups = course_student_groups.get(course_id, set())
#             for used_faculty, used_room, used_group in time_slot_usage[time_slot]:
#                 if faculty_id == used_faculty or room_id == used_room or not student_groups.isdisjoint(used_group):
#                     clashes += 1
#             time_slot_usage[time_slot].append((faculty_id, room_id, student_groups))
#         if clashes > 0: return -1000 * clashes,
        
#         for course_id, _, room_id, faculty_id in individual:
#             faculty_info = faculty_df.loc[faculty_id]
#             course_info = courses_df.loc[course_id]
#             if course_info['course_code'] not in faculty_info['expertise']: penalties += 5
#             room_capacity = rooms_df.loc[room_id]['capacity']
#             num_students = len(enrollments_df[enrollments_df['course_id'] == course_id])
#             if num_students > room_capacity: penalties += 10
        
#         group_schedules = defaultdict(lambda: defaultdict(list))
#         for course_id, time_slot, _, _ in individual:
#             day, hour_str = time_slot.split('_')
#             hour = int(hour_str.split('-')[0])
#             for group in course_student_groups.get(course_id, set()):
#                 group_schedules[group][day].append(hour)
        
#         total_gaps = 0
#         for group in group_schedules:
#             for day in group_schedules[group]:
#                 if len(group_schedules[group][day]) > 1:
#                     sorted_hours = sorted(group_schedules[group][day])
#                     total_gaps += (sorted_hours[-1] - sorted_hours[0] + 1) - len(sorted_hours)
#         penalties += total_gaps

#         return -penalties,

#     toolbox.register("evaluate", evaluate_timetable)
#     toolbox.register("mate", tools.cxTwoPoint)
#     toolbox.register("mutate", tools.mutShuffleIndexes, indpb=0.1)
#     toolbox.register("select", tools.selTournament, tournsize=3)


#     print("Starting genetic algorithm...")
#     POPULATION_SIZE, CROSSOVER_PROB, MUTATION_PROB, NUM_GENERATIONS = 300, 0.8, 0.2, 80
#     pop = toolbox.population(n=POPULATION_SIZE)
#     hof = tools.HallOfFame(1)
#     stats = tools.Statistics(lambda ind: ind.fitness.values)
#     stats.register("avg", np.mean)
#     stats.register("max", np.max)
#     algorithms.eaSimple(pop, toolbox, cxpb=CROSSOVER_PROB, mutpb=MUTATION_PROB, ngen=NUM_GENERATIONS, stats=stats, halloffame=hof, verbose=True)
#     best_individual = hof[0]
#     print(f"\n--- Best Timetable Found --- Fitness Score: {best_individual.fitness.values[0]}")


#     print("Formatting and uploading the final timetable...")
#     try:

#         courses_df.reset_index(inplace=True)
#         faculty_df.reset_index(inplace=True)
#         rooms_df.reset_index(inplace=True)

#         best_timetable_df = pd.DataFrame(best_individual, columns=["course_id", "time_slot", "room_id", "faculty_id"])
#         final_schedule = best_timetable_df.merge(courses_df, on="course_id").merge(programs_df, on="program_id").merge(faculty_df, on="faculty_id").merge(rooms_df, on="room_id")
        
#         day_map = {'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday', 'Thu': 'Thursday', 'Fri': 'Friday'}
#         split_time = final_schedule['time_slot'].str.split('_', expand=True)
#         final_schedule['Day'], final_schedule['Time'] = split_time[0].map(day_map), split_time[1]
        
#         day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
#         final_schedule['Day'] = pd.Categorical(final_schedule['Day'], categories=day_order, ordered=True)
        
#         final_schedule_sorted = final_schedule[["Day", "Time", "program_code", "course_code", "course_name", "course_type", "credits", "faculty_name", "room_name", "capacity", "room_type"]].sort_values(by=["Day", "Time", "program_code"]).reset_index(drop=True)
        
#         print("\n--- Final Schedule (Formatted) ---")
#         print(final_schedule_sorted.to_string())

#         data_to_upload = final_schedule_sorted.to_dict(orient='records')
#         supabase.table('final_timetable').delete().neq('Day', 'dummy_value_to_delete_all').execute()
#         supabase.table('final_timetable').insert(data_to_upload).execute()
        
#         print("\n Success! Timetable data has been updated in Supabase.")
#         return "SUCCESS"
#     except Exception as e:
#         print(f"\n An error occurred during formatting or upload: {e}")
#         return "FAILURE"

# if __name__ == "__main__":
#     run_timetable_generation()









import pandas as pd 
print("Imported pandas")
from collections import defaultdict
print("Imported defaultdict")
import numpy as np
print("Imported numpy")
from supabase import create_client, Client
print("Imported supabase")
import os
print("Imported os")
from dotenv import load_dotenv
print("Imported dotenv")

from deap import base, creator, tools, algorithms
print("Imported deap")

print("About to define function...")

def run_timetable_generation():
    print("Function is being defined!")
    """
    Main function to connect to data, run the genetic algorithm,
    format the result, and upload it to Supabase.
    """
    import random
    import pandas as pd
    from collections import defaultdict
    import numpy as np
    from supabase import create_client, Client
    import os
    from dotenv import load_dotenv
    from deap import base, creator, tools, algorithms
 
    load_dotenv()
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")

    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Successfully connected to Supabase!")
        
        print("Fetching data...")
        programs_df = pd.DataFrame(supabase.table('programs').select('*').execute().data)
        courses_df = pd.DataFrame(supabase.table('courses').select('*').execute().data)
        faculty_df = pd.DataFrame(supabase.table('faculty').select('*').execute().data)
        rooms_df = pd.DataFrame(supabase.table('rooms').select('*').execute().data)
        students_df = pd.DataFrame(supabase.table('students').select('*').execute().data)
        enrollments_df = pd.DataFrame(supabase.table('student_enrollments').select('*').execute().data)
        print("All data successfully fetched.")
    except Exception as e:
        print(f"An error occurred while fetching from Supabase: {e}")
        return "FAILURE: Data fetching error."

    # Set index for faster lookups
    courses_df.set_index('course_id', inplace=True)
    faculty_df.set_index('faculty_id', inplace=True)
    rooms_df.set_index('room_id', inplace=True)

    # Updated TIME_SLOTS with lunch break (12-01 replaced with 01-02)
    TIME_SLOTS = [
        "Mon_09-10", "Mon_10-11", "Mon_11-12", "Mon_01-02", "Mon_02-03", "Mon_03-04", 
        "Tue_09-10", "Tue_10-11", "Tue_11-12", "Tue_01-02", "Tue_02-03", "Tue_03-04", 
        "Wed_09-10", "Wed_10-11", "Wed_11-12", "Wed_01-02", "Wed_02-03", "Wed_03-04", 
        "Thu_09-10", "Thu_10-11", "Thu_11-12", "Thu_01-02", "Thu_02-03", "Thu_03-04", 
        "Fri_09-10", "Fri_10-11", "Fri_11-12", "Fri_01-02", "Fri_02-03", "Fri_03-04"
    ]
    COURSE_IDS = courses_df.index.tolist()
    ROOM_IDS = rooms_df.index.tolist()

    students_df['student_group'] = students_df['program_id'] + '_Sem' + students_df['current_semester'].astype(str)
    student_to_group = dict(zip(students_df['student_id'], students_df['student_group']))
    course_student_groups = defaultdict(set)
    for _, row in enrollments_df.iterrows():
        student_id, course_id = row['student_id'], row['course_id']
        if student_id in student_to_group:
            course_student_groups[course_id].add(student_to_group[student_id])

    course_to_valid_faculty = {}
    for cid in COURSE_IDS:
        course_code = courses_df.loc[cid]['course_code']
        valid_faculty = faculty_df[faculty_df['expertise'].str.contains(course_code, na=False)].index.tolist()
        course_to_valid_faculty[cid] = valid_faculty if valid_faculty else faculty_df.index.tolist()

    # Duration mapping for courses
    course_to_duration = {}
    for course_id, course_data in courses_df.iterrows():
        if course_data.get('practical_hours_week', 0) > 0:
            course_to_duration[course_id] = 2
        else:
            course_to_duration[course_id] = 1

    # Genetic Algorithm Setup
    creator.create("FitnessMax", base.Fitness, weights=(1.0,))
    creator.create("Individual", list, fitness=creator.FitnessMax)
    toolbox = base.Toolbox()

    def create_gene_for_course(course_id):
        return (course_id, random.choice(TIME_SLOTS), random.choice(ROOM_IDS), random.choice(course_to_valid_faculty[course_id]))
    
    def create_full_individual():
        return [create_gene_for_course(cid) for cid in COURSE_IDS]

    toolbox.register("individual", tools.initIterate, creator.Individual, create_full_individual)
    toolbox.register("population", tools.initRepeat, list, toolbox.individual)

    # Upgraded Fitness Function (Duration-Aware)
    def evaluate_timetable(individual):
        clashes = 0
        time_slot_usage = defaultdict(list)

        def get_occupied_slots(start_slot, duration):
            try:
                day, time_str = start_slot.split('_')
                start_hour = int(time_str.split('-')[0])
                if start_hour < 9: start_hour += 12
                occupied = []
                for i in range(duration):
                    hour = start_hour + i
                    display_hour = hour if hour <= 12 else hour - 12
                    next_hour = display_hour + 1
                    if display_hour == 11 and next_hour == 12: next_hour = 1
                    slot = f"{day}_{display_hour:02d}-{next_hour:02d}"
                    occupied.append(slot)
                return occupied
            except (ValueError, IndexError):
                return [start_slot]

        for course_id, start_time_slot, room_id, faculty_id in individual:
            duration = course_to_duration.get(course_id, 1)
            occupied_slots = get_occupied_slots(start_time_slot, duration)
            for time_slot in occupied_slots:
                if time_slot not in TIME_SLOTS:
                    clashes += 1
                    continue
                student_groups = course_student_groups.get(course_id, set())
                for used_faculty, used_room, used_group in time_slot_usage[time_slot]:
                    if faculty_id == used_faculty or room_id == used_room or not student_groups.isdisjoint(used_group):
                        clashes += 1
                time_slot_usage[time_slot].append((faculty_id, room_id, student_groups))

        if clashes > 0: return -1000 * clashes,
        
        penalties = 0
        for course_id, _, room_id, faculty_id in individual:
            faculty_info = faculty_df.loc[faculty_id]
            course_info = courses_df.loc[course_id]
            if course_info['course_code'] not in faculty_info['expertise']: penalties += 5
            room_capacity = rooms_df.loc[room_id]['capacity']
            num_students = len(enrollments_df[enrollments_df['course_id'] == course_id])
            if num_students > room_capacity: penalties += 10
        
        group_schedules = defaultdict(lambda: defaultdict(list))
        for course_id, time_slot, _, _ in individual:
            day, hour_str = time_slot.split('_')
            hour = int(hour_str.split('-')[0])
            for group in course_student_groups.get(course_id, set()):
                group_schedules[group][day].append(hour)
        
        total_gaps = 0
        for group in group_schedules:
            for day in group_schedules[group]:
                if len(group_schedules[group][day]) > 1:
                    sorted_hours = sorted(group_schedules[group][day])
                    total_gaps += (sorted_hours[-1] - sorted_hours[0] + 1) - len(sorted_hours)
        penalties += total_gaps

        return -penalties,

    toolbox.register("evaluate", evaluate_timetable)
    toolbox.register("mate", tools.cxTwoPoint)
    toolbox.register("mutate", tools.mutShuffleIndexes, indpb=0.1)
    toolbox.register("select", tools.selTournament, tournsize=3)

    # Run the Algorithm
    print("Starting genetic algorithm...")
    POPULATION_SIZE, CROSSOVER_PROB, MUTATION_PROB, NUM_GENERATIONS = 300, 0.8, 0.2, 80
    pop = toolbox.population(n=POPULATION_SIZE)
    hof = tools.HallOfFame(1)
    stats = tools.Statistics(lambda ind: ind.fitness.values)
    stats.register("avg", np.mean)
    stats.register("max", np.max)
    algorithms.eaSimple(pop, toolbox, cxpb=CROSSOVER_PROB, mutpb=MUTATION_PROB, ngen=NUM_GENERATIONS, stats=stats, halloffame=hof, verbose=True)
    best_individual = hof[0]
    print(f"\n--- Best Timetable Found --- Fitness Score: {best_individual.fitness.values[0]}")

    # Format and Upload the Final Timetable
    print("Formatting and uploading the final timetable...")
    try:
        courses_df.reset_index(inplace=True)
        faculty_df.reset_index(inplace=True)
        rooms_df.reset_index(inplace=True)

        best_timetable_df = pd.DataFrame(best_individual, columns=["course_id", "time_slot", "room_id", "faculty_id"])
        final_schedule = best_timetable_df.merge(courses_df, on="course_id").merge(programs_df, on="program_id").merge(faculty_df, on="faculty_id").merge(rooms_df, on="room_id")
        
        day_map = {'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday', 'Thu': 'Thursday', 'Fri': 'Friday'}
        split_time = final_schedule['time_slot'].str.split('_', expand=True)
        final_schedule['Day'], final_schedule['Time'] = split_time[0].map(day_map), split_time[1]
        
        day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        final_schedule['Day'] = pd.Categorical(final_schedule['Day'], categories=day_order, ordered=True)
        
        final_schedule_sorted = final_schedule[["Day", "Time", "program_code", "course_code", "course_name", "course_type", "credits", "faculty_name", "room_name", "capacity", "room_type"]].sort_values(by=["Day", "Time", "program_code"]).reset_index(drop=True)
        
        print("\n--- Final Schedule (Formatted) ---")
        print(final_schedule_sorted.to_string())

        data_to_upload = final_schedule_sorted.to_dict(orient='records')
        supabase.table('final_timetable').delete().neq('Day', 'dummy_value_to_delete_all').execute()
        supabase.table('final_timetable').insert(data_to_upload).execute()
        
        print("\n Success! Timetable data has been updated in Supabase.")
        return "SUCCESS"
    except Exception as e:
        print(f"\n An error occurred during formatting or upload: {e}")
        return "FAILURE"