import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/source/http_method.dart';
import 'package:mzizi_api/src/enums/source/path_kind.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/domains.dart';

part 'paths.g.dart';

/// Any location on a domain: a page, listing, file, feed or API endpoint.
@JsonSerializable(includeIfNull: false)
class SourcePaths {
  const SourcePaths({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.domainId,
    required this.id,
    required this.kind,
    required this.method,
    this.note,
    this.noteLanguageId,
    required this.path,
    this.query,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String domainId;
  final String id;
  final SourcePathKind kind;
  final SourceHttpMethod method;
  final String? note;
  final String? noteLanguageId;
  final String path;
  final String? query;
  final DateTime updatedAt;
  final int version;

  factory SourcePaths.fromJson(Map<String, dynamic> json) => _$SourcePathsFromJson(json);

  Map<String, dynamic> toJson() => _$SourcePathsToJson(this);
}
