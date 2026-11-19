import 'package:json_annotation/json_annotation.dart';

part 'engagement.g.dart';

/// Engagement
@JsonSerializable(includeIfNull: false)
class InteractionsEngagement {
  const InteractionsEngagement({required this.liked, required this.likes});
  final bool liked;
  final int likes;

  factory InteractionsEngagement.fromJson(Map<String, dynamic> json) => _$InteractionsEngagementFromJson(json);

  Map<String, dynamic> toJson() => _$InteractionsEngagementToJson(this);
}
