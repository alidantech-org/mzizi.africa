import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/community/post_state.dart';
import 'package:mzizi_api/src/models/auth/accounts.dart';
import 'package:mzizi_api/src/models/community/posts.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'cases.g.dart';

/// The moderation of one post.
@JsonSerializable(includeIfNull: false)
class CommunityCases {
  const CommunityCases({
    required this.createdAt,
    this.decidedAt,
    this.decisionTerm,
    this.deletedAt,
    required this.id,
    required this.postCountryId,
    required this.postId,
    this.reason,
    this.reviewerAccountId,
    required this.state,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? decidedAt;
  final String? decisionTerm;
  final DateTime? deletedAt;
  final String id;
  final String postCountryId;
  final String postId;
  final String? reason;
  final String? reviewerAccountId;
  final CommunityPostState state;
  final DateTime updatedAt;
  final int version;

  factory CommunityCases.fromJson(Map<String, dynamic> json) => _$CommunityCasesFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityCasesToJson(this);
}
