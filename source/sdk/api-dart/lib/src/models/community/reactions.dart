import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/community/actors.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/media/articles.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'reactions.g.dart';

/// A member's reaction to a post, named thing or article.
@JsonSerializable(includeIfNull: false)
class CommunityReactions {
  const CommunityReactions({
    required this.actorId,
    this.articleId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    this.identityId,
    required this.kindTerm,
    this.postCountryId,
    this.postId,
    required this.updatedAt,
    required this.version,
  });
  final String actorId;
  final String? articleId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String? identityId;
  final String kindTerm;
  final String? postCountryId;
  final String? postId;
  final DateTime updatedAt;
  final int version;

  factory CommunityReactions.fromJson(Map<String, dynamic> json) => _$CommunityReactionsFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityReactionsToJson(this);
}
