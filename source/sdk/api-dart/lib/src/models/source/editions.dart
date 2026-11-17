import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/language.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/products.dart';

part 'editions.g.dart';

/// A meaningfully distinct release of a product. Another format or scan of the same wording is an artifact, not an edition.
@JsonSerializable(includeIfNull: false)
class SourceEditions {
  const SourceEditions({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.description,
    required this.designation,
    required this.id,
    this.languageId,
    required this.productId,
    this.publishedOn,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? description;
  final String designation;
  final String id;
  final String? languageId;
  final String productId;
  final DateTime? publishedOn;
  final DateTime updatedAt;
  final int version;

  factory SourceEditions.fromJson(Map<String, dynamic> json) => _$SourceEditionsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceEditionsToJson(this);
}
