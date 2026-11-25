import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/community/posts.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'replies.g.dart';

/// An official response to a post.
@JsonSerializable(includeIfNull: false)
class CommunityReplies {
  const CommunityReplies({
    required this.body,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.languageId,
    required this.postCountryId,
    required this.postId,
    this.publishedAt,
    required this.receivedAt,
    required this.respondentId,
    required this.statusTerm,
    required this.updatedAt,
    required this.version,
  });
  final String body;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String languageId;
  final String postCountryId;
  final String postId;
  final DateTime? publishedAt;
  final DateTime receivedAt;
  final String respondentId;
  final String statusTerm;
  final DateTime updatedAt;
  final int version;

  factory CommunityReplies.fromJson(Map<String, dynamic> json) => _$CommunityRepliesFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityRepliesToJson(this);
}
