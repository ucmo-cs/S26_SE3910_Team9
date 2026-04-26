package com.team9.appointmentservice.service;

import com.team9.appointmentservice.dto.BranchResponse;
import com.team9.appointmentservice.dto.TopicResponse;
import com.team9.appointmentservice.model.Branch;
import com.team9.appointmentservice.model.Topic;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReferenceDataService {
    private final List<Topic> topics = List.of(
            new Topic("t1", "Open a new account", "✨", "Open new checking, savings, or student accounts with the right product mix.", "Identity verification, account options, and online banking setup.", "30 minutes"),
            new Topic("t2", "Credit card support", "💳", "Get support for card issues, replacements, fraud review, or spending controls.", "Card activation, disputed transactions, and limit/payment guidance.", "20-30 minutes"),
            new Topic("t3", "Loan consultation", "🏠", "Discuss mortgage, auto, or personal loan options and qualification steps.", "Rate comparison, required documents, and next-step planning.", "45 minutes"),
            new Topic("t4", "Wealth Management", "📈", "Review savings goals, investment planning, and risk-aligned portfolio options.", "Goal planning, account types, and long-term strategy conversations.", "45-60 minutes"),
            new Topic("t5", "Notary Services", "✒️", "In-branch notarization support for eligible forms and official signatures.", "Document checks, signer verification, and witness requirements.", "15-30 minutes")
    );

    private final List<Branch> branches = List.of(
            new Branch("b1", "Downtown Branch", List.of("t1", "t2", "t3", "t4")),
            new Branch("b2", "Westside Branch", List.of("t2", "t3", "t5")),
            new Branch("b3", "Eastside Branch", List.of("t1", "t4", "t5")),
            new Branch("b4", "North Hills (HQ)", List.of("t1", "t2", "t3", "t4", "t5"))
    );

    public List<TopicResponse> getTopics() {
        return topics.stream()
                .map(topic -> new TopicResponse(topic.id(), topic.name(), topic.icon(), topic.overview(), topic.typicalHelp(), topic.suggestedDuration()))
                .toList();
    }

    public List<BranchResponse> getBranches() {
        return branches.stream()
                .map(branch -> new BranchResponse(branch.id(), branch.name(), branch.topicIds()))
                .toList();
    }

    public boolean branchSupportsTopic(String branchId, String topicId) {
        return branches.stream()
                .filter(branch -> branch.id().equals(branchId))
                .findFirst()
                .map(branch -> branch.topicIds().contains(topicId))
                .orElse(false);
    }
}
