import { container } from "tsyringe";
import { SessionRepository } from "./application/repositories/sessionRepository";
import { DynamoRepository } from "./infrastructure/dynamo/DynamoRepository";
import { UserRepository } from "./application/repositories/userRepository";


container.register("DynamoRepository", {
    useValue: DynamoRepository,
})

container.register("SessionRepository", {
    useValue: SessionRepository,
})

container.register("UserRepository", {
    useValue: UserRepository,
})


export { container };
