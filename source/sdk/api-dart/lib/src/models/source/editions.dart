import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/products.dart';

part 'editions.g.dart';

/// One issue of a product.
@JsonSerializable(includeIfNull: false)
class SourceEditions {
  const SourceEditions({
    required this.code,
    required this.createdAt,
    this.deletedAt,
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
