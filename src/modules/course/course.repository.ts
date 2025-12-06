import { EntityRepository } from "@mikro-orm/postgresql";
import { AuthError } from "../common/utils.js";
import { Course } from "./course.entity.js";

export class CourseRepository extends EntityRepository<Course> {
    async getCourse(id: string) {
        const course = await this.findOneOrFail({ id });
        return course;
    }

    async getCourseUserRef(id: string) {
        const course = await this.findOneOrFail({ id }, { populate: ["users:ref"]});
        return course;
    }

    async getUserEnrolledCourses(id: string) {
        const courses = this.find({ users: { id } });
        return courses;
    }
}