import React from "react";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../images/zucchini-real.jpg";

export default function About() {
    return (
        <>
            <Card>
                <Card.Img variant="top" src={logo} />
                <Card.Body>
                    <Card.Title>ZuccchiniLauncher</Card.Title>
                    <Card.Text>Приложение для запуска, мониторинга и обработки результатов Cucumber тестов.</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>
                        <Link to="/">Dashboard</Link> - страница отображает текущий статус тестов: показывает запущенные тесты, тесты находящиеся в
                        очереди, и последние 10 завершенных тестов. Вы можете просмтривать детали каждого теста, удалять тесты из очереди ожидания и
                        открывать результаты завершённых тестов.
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Link to="/features">Features</Link> - страница для просмотра, изменения и создания новый тестовых сценариц (.feature файлов).
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Link to="/about">About</Link> - вы здесь :)
                    </ListGroup.Item>
                    <ListGroupItem>
                        <span className="badge bg-success">&lt;Имя пользователя&gt;</span> - вы можете разлогиниться из программы нажав эту кнопку.
                    </ListGroupItem>
                </ListGroup>
            </Card>
        </>
    );
}
